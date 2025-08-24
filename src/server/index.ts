import { Hono } from 'hono';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode('REPLACE_THIS_WITH_A_SECRET_KEY'); // TODO: Use env var for production
const JWT_EXPIRY = 2 * 60 * 60; // 2 hours in seconds

type Bindings = {
  DB: D1Database;
};

export const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// Extend Hono's ContextVariableMap
declare module 'hono' {
  interface ContextVariableMap {
    user?: {
      userid: string;
      email: string;
      role: string;
      [key: string]: unknown;
    };
  }
}

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
    if (teams.toLowerCase() === 'freshmen') {
      conditions.push("(LOWER(teams) = 'freshmen' OR LOWER(teams) = 'freshman')");
    } else {
      conditions.push("LOWER(teams) = LOWER(?)");
      bindings.push(teams);
    }
  }
  if (gameDate) {
    conditions.push("gameDate = ?");
    bindings.push(gameDate);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY gameDate ASC";

  try {
    // In middleware, we get the env from Astro.locals.runtime.env
    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
    return c.json(results);
  } catch (e) {
    console.error('D1 Error:', (e as Error).message);
    return c.json({ error: 'Failed to fetch games' }, 500);
  }
});

// Add user type to context
type User = {
  userid: string;
  email: string;
  role: string;
  [key: string]: unknown;
};

declare module 'hono' {
  interface ContextVariableMap {
    user?: User;
  }
}

// POST /login endpoint

app.get('/logout', async (c) => {
  c.header('Set-Cookie', 'auth=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0');
  return c.redirect('/');
});

app.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ error: 'Email and password required.' }, 400);
  }

  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).all();
    const user = results && results[0];
    console.log('DEBUG user:', user);
    if (!user) {
      return c.json({ error: 'Invalid email or password.' }, 401);
    }
    const valid = await bcrypt.compare(password, user.password as string);
    if (!valid) {
      return c.json({ error: 'Invalid email or password.' }, 401);
    }
    // Create JWT with jose
    const token = await new SignJWT({ userid: user.userid, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(`${JWT_EXPIRY}s`)
      .sign(JWT_SECRET);
    c.header('Set-Cookie', `auth=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${JWT_EXPIRY}`);
    return c.json({ success: true });
  } catch (e) {
    console.error('Login error:', (e as Error).message);
    return c.json({ error: 'Login failed.' }, 500);
  }
});

// Create game_updates table if it doesn't exist
const CREATE_UPDATES_TABLE = `
  CREATE TABLE IF NOT EXISTS game_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    update_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games2025(id)
  )
`;

// Ensure the updates table exists when the server starts
app.use('*', async (c, next) => {
  try {
    await c.env.DB.prepare(CREATE_UPDATES_TABLE).run();
  } catch (e) {
    console.error('Error creating updates table:', e);
  }
  await next();
});

app.patch('/games/:id', async (c) => {
  const id = c.req.param('id');
  const { ehsFinal, oppFinal, updateText } = await c.req.json();
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const userEmail = user.email;

  if (!id || ehsFinal === undefined || oppFinal === undefined) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    const statements = [
      // Update game scores
      c.env.DB.prepare("UPDATE games2025 SET ehsFinal = ?, oppFinal = ? WHERE id = ?")
        .bind(ehsFinal, oppFinal, id)
    ];

    // Add update text if provided
    if (updateText && userEmail) {
      statements.push(
        c.env.DB.prepare(
          `INSERT INTO game_updates (game_id, user_email, update_text) 
           VALUES (?, ?, ?)`
        ).bind(id, userEmail, updateText)
      );
    }
    
    // Execute all statements in a batch
    await c.env.DB.batch(statements);

    // Fetch the latest updates to return
    const updates = await c.env.DB.prepare(
      `SELECT * FROM game_updates 
       WHERE game_id = ? 
       ORDER BY created_at DESC`
    ).bind(id).all();

    return c.json({ 
      success: true, 
      message: `Game ${id} updated${updateText ? ' with note' : ''}.`,
      updates: updates.results || []
    });
  } catch (e) {
    console.error('Update Error:', e);
    return c.json({ 
      error: 'Failed to update game',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, 500);
  }
});

// Get updates for a game
app.get('/games/:id/updates', async (c) => {
  const id = c.req.param('id');
  
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, game_id, user_email, update_text, 
             strftime('%Y-%m-%d %H:%M', created_at) as created_at
      FROM game_updates 
      WHERE game_id = ? 
      ORDER BY created_at DESC
    `).bind(id).all();
    
    return c.json(results || []);
  } catch (e) {
    console.error('Fetch Updates Error:', (e as Error).message);
    return c.json({ error: 'Failed to fetch updates' }, 500);
  }
});
