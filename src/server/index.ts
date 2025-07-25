import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
}

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
