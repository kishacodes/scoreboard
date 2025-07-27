import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
}

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'REPLACE_THIS_WITH_A_SECRET'; // TODO: Use env var for production
const JWT_EXPIRY = '2h';

export const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

app.get('/games', async (c) => {
  const { team, teams, gameDate } = c.req.query();

  let query = "SELECT * FROM games2025";
  const conditions = [];
  const bindings = [];

  if (team) {
    conditions.push("(ehs LIKE ? OR opp LIKE ?)");
    bindings.push(`%${team}%`, `%${team}%`);
  }
  if (teams) {
    conditions.push("LOWER(teams) = LOWER(?)");
    bindings.push(teams);
  }
  if (gameDate) {
    conditions.push("gameDate = ?");
    bindings.push(gameDate);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY gameDate DESC";

  try {
    // In middleware, we get the env from Astro.locals.runtime.env
    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
    return c.json(results);
  } catch (e) {
    console.error('D1 Error:', (e as Error).message);
    return c.json({ error: 'Failed to fetch games' }, 500);
  }
});

// POST /login endpoint
app.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ error: 'Email and password required.' }, 400);
  }

  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).all();
    const user = results && results[0];
    if (!user) {
      return c.json({ error: 'Invalid email or password.' }, 401);
    }
    const valid = await bcrypt.compare(password, user.password as string);
    if (!valid) {
      return c.json({ error: 'Invalid email or password.' }, 401);
    }
    // Create JWT
    const token = jwt.sign({ userid: user.userid, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    c.header('Set-Cookie', `auth=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=7200`); // 2h expiry
    return c.json({ success: true });
  } catch (e) {
    console.error('Login error:', (e as Error).message);
    return c.json({ error: 'Login failed.' }, 500);
  }
});

app.patch('/games/:id', async (c) => {
  const id = c.req.param('id');
  const { ehsFinal, oppFinal } = await c.req.json();

  if (!id || ehsFinal === undefined || oppFinal === undefined) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    const query = "UPDATE games2025 SET ehsFinal = ?, oppFinal = ? WHERE id = ?";
    await c.env.DB.prepare(query).bind(ehsFinal, oppFinal, id).run();
    return c.json({ success: true, message: `Game ${id} updated.` });
  } catch (e) {
    console.error('D1 Update Error:', (e as Error).message);
    return c.json({ error: 'Failed to update game' }, 500);
  }
});
