import { Hono } from 'hono';
import { SignJWT, jwtVerify } from 'jose';
import { getCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode('REPLACE_THIS_WITH_A_SECRET_KEY'); // TODO: Use env var for production
const JWT_EXPIRY = 2 * 60 * 60; // 2 hours in seconds

type Bindings = {
  DB: D1Database;
};

export const app = new Hono<{ Bindings: Bindings }>();

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

app.get('/api/games', async (c) => {
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

  // Compute today's date in Central Time (America/Chicago) as YYYY-MM-DD
  const centralNow = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
  );
  const yyyy = centralNow.getFullYear();
  const mm = String(centralNow.getMonth() + 1).padStart(2, '0');
  const dd = String(centralNow.getDate()).padStart(2, '0');
  const todayCentral = `${yyyy}-${mm}-${dd}`;

  // Upcoming (today or later) first, then past; then by date ascending
  query += " ORDER BY CASE WHEN gameDate >= ? THEN 0 ELSE 1 END ASC, gameDate ASC";
  bindings.push(todayCentral);

  try {
    // In middleware, we get the env from Astro.locals.runtime.env
    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
    // Add CDN caching headers (short-lived)
    c.header('Cache-Control', 'public, max-age=30, s-maxage=120, stale-while-revalidate=60');
    return c.json(results);
  } catch (e) {
    // DB fetch error
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

app.get('/api/logout', async (c) => {
  c.header('Set-Cookie', 'auth=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0');
  return c.redirect('/');
});

app.post('/api/login', async (c) => {
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
    // Create JWT with jose
    const token = await new SignJWT({ userid: user.userid, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(`${JWT_EXPIRY}s`)
      .sign(JWT_SECRET);
    
    // Set cookie with secure attributes
    const cookieOptions = [
      `auth=${token}`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=Lax',  // Changed from Strict to Lax for cross-site requests
      `Max-Age=${JWT_EXPIRY}`
      // Removed Domain restriction to work with all deployment URLs
    ].join('; ');
    
    c.header('Set-Cookie', cookieOptions);
    return c.json({ 
      success: true,
      token // Include the token in the response for client-side storage
    });
  } catch (e) {
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
    ehs_score INTEGER,
    opp_score INTEGER,
    qtr TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games2025(id)
  )
`;

// CORS middleware
app.use('*', async (c, next) => {
  const origin = c.req.header('origin');
  
  // Set CORS headers
  c.header('Access-Control-Allow-Origin', origin || '*');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  c.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      }
    });
  }
  
  await next();
});

// Skip auth for login and public routes
const publicRoutes = [
  '/api/login',
  '/login',
  '/logout',
  '/api/health'
];

// Define exact public routes
const exactPublicRoutes = [
  '/api/games', // The main games listing is public
  '/api/games/updates' // Batch updates endpoint is public
];

// Define public route patterns (using regex patterns)
const publicRoutePatterns = [
  /^\/api\/games\/\d+\/updates$/ // Game updates endpoints are public
];

// Auth middleware
app.use('*', async (c, next) => {
  const path = c.req.path;
  
  // auth middleware
  
  // Skip auth for exact matches first
  if (exactPublicRoutes.includes(path)) {
    // public route exact match
    return next();
  }
  
  // Skip auth for regex pattern matches
  if (publicRoutePatterns.some(pattern => pattern.test(path))) {
    // public route pattern match
    return next();
  }
  
  // Skip auth for prefix public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    // public route prefix match
    return next();
  }
  
  // protected route
  
  // Check for token in Authorization header or cookie
  let token = '';
  const authHeader = c.req.header('Authorization');
  
  // Try to get token from Authorization header first
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } 
  // Then try to get from cookies
  else if (c.req.raw.headers.has('cookie')) {
    const cookies = c.req.raw.headers.get('cookie') || '';
    const match = cookies.match(/auth=([^;]+)/);
    token = match ? match[1] : '';
    if (token) {
      // token found in cookies
    }
  }
  
  // If no token found, redirect to login for web routes or return 401 for API
  if (!token) {
    // No token found in request
    if (path.startsWith('/api/')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    return c.redirect('/login');
  }
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Ensure the payload has the expected shape
    const user = {
      userid: payload.userid as string,
      email: payload.email as string,
      role: payload.role as string,
      ...payload
    };
    c.set('user', user);
  } catch (e) {
    // Token verification failed
    
    if (path.startsWith('/api/')) {
      return c.json({ 
        error: 'Invalid or expired token',
        details: e instanceof Error ? e.message : 'Unknown error'
      }, 401);
    }
    return c.redirect('/login');
  }
  
  await next();
});

// Ensure the updates table exists
app.use('*', async (c, next) => {
  try {
    await c.env.DB.prepare(CREATE_UPDATES_TABLE).run();
    // Best-effort schema migration: add missing columns if table already existed
    try { await c.env.DB.prepare("ALTER TABLE game_updates ADD COLUMN ehs_score INTEGER").run(); } catch (e) {}
    try { await c.env.DB.prepare("ALTER TABLE game_updates ADD COLUMN opp_score INTEGER").run(); } catch (e) {}
    try { await c.env.DB.prepare("ALTER TABLE game_updates ADD COLUMN qtr TEXT").run(); } catch (e) {}
  } catch (e) {
    // ignore create table errors
  }
  await next();
});

app.patch('/api/games/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const { ehsScore, oppScore, updateText, qtr, timeInqtr, final, ehsFinal, oppFinal } = body;
    // request body parsed
    
    // Get user from context (set by auth middleware)
    const user = c.get('user');
    
    // Validate user is authenticated
    if (!user) {
      return c.json({ error: 'Unauthorized', detail: 'No user in context' }, 401);
    }
    
    const userEmail = user.email;

    // Validate required fields
    if (!id) {
      return c.json({ error: 'Missing game ID' }, 400);
    }
    
    if (ehsScore === undefined || oppScore === undefined) {
      return c.json({ error: 'Missing required score fields' }, 400);
    }
    
    // preparing database statements
    
    // Check if the game exists first
    const gameCheck = await c.env.DB.prepare(
      "SELECT id FROM games2025 WHERE id = ?"
    ).bind(id).first();
    
    if (!gameCheck) {
      return c.json({ error: `Game with ID ${id} not found` }, 404);
    }

    // Prepare SQL statement based on whether the game is final or not
    let updateStatement;
    const params = [];
    
    // DB connection check
    
    // Check if final is explicitly 1 (could be string '1' or number 1)
    const isFinal = final === 1 || final === '1';
    
    if (isFinal) {
      // If game is marked as final, update all fields including final status and final scores
      updateStatement = "UPDATE games2025 SET ehsScore = ?, oppScore = ?, qtr = ?, timeInqtr = ?, final = ?, ehsFinal = ?, oppFinal = ? WHERE id = ?";
      params.push(ehsScore, oppScore, qtr || null, timeInqtr || null, 1, ehsFinal || ehsScore, oppFinal || oppScore, id);
    } else {
      // Regular score update without changing final status
      updateStatement = "UPDATE games2025 SET ehsScore = ?, oppScore = ?, qtr = ?, timeInqtr = ? WHERE id = ?";
      params.push(ehsScore, oppScore, qtr || null, timeInqtr || null, id);
    }
    
    const statements = [
      // Update game information with the appropriate statement
      c.env.DB.prepare(updateStatement).bind(...params)
    ];

    // Add update text if provided
    if (updateText && userEmail) {
      statements.push(
        c.env.DB.prepare(
          `INSERT INTO game_updates (game_id, user_email, update_text, ehs_score, opp_score, qtr) 
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(id, userEmail, updateText, ehsScore, oppScore, qtr || null)
      );
    }
    
    // Execute all statements in a batch
    await c.env.DB.batch(statements);

    // Fetch the latest updates to return
    const updatesResult = await c.env.DB.prepare(
      `SELECT * FROM game_updates 
       WHERE game_id = ? 
       ORDER BY created_at DESC`
    ).bind(id).all();
    
    return c.json({ 
      success: true, 
      message: `Game ${id} updated${updateText ? ' with note' : ''}.`,
      updates: updatesResult.results || []
    });
  } catch (e) {
    return c.json({ 
      error: 'Failed to update game',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, 500);
  }
});

// Get updates for a game - public endpoint
app.get('/api/games/:id/updates', async (c) => {
  const id = c.req.param('id');
  
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, game_id, user_email, update_text,
             ehs_score, opp_score, qtr,
             strftime('%Y-%m-%d %H:%M', created_at) as created_at
      FROM game_updates 
      WHERE game_id = ? 
      ORDER BY created_at DESC
    `).bind(id).all();
    // Add CDN caching headers for updates (short-lived)
    c.header('Cache-Control', 'public, max-age=15, s-maxage=60, stale-while-revalidate=60');
    return c.json(results || []);
  } catch (e) {
    return c.json({ error: 'Failed to fetch updates' }, 500);
  }
});

// Get updates for multiple games (batched) - public endpoint
app.get('/api/games/updates', async (c) => {
  const { ids = '', limit } = c.req.query();
  const rawIds = String(ids)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const gameIds = rawIds
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));

  // Nothing to fetch, return empty map
  if (gameIds.length === 0) {
    c.header('Cache-Control', 'public, max-age=15, s-maxage=60, stale-while-revalidate=60');
    return c.json({});
  }

  // Limit per game (1..50), default 5
  const perGame = Math.max(1, Math.min(50, Number(limit) || 5));

  const placeholders = gameIds.map(() => '?').join(',');
  const sql = `
    SELECT id, game_id, user_email, update_text,
           ehs_score, opp_score, qtr,
           strftime('%Y-%m-%d %H:%M', created_at) as created_at
    FROM game_updates
    WHERE game_id IN (${placeholders})
    ORDER BY game_id ASC, created_at DESC
  `;

  try {
    const { results } = await c.env.DB.prepare(sql).bind(...gameIds).all();
    const map: Record<string, any[]> = {};
    for (const gid of gameIds) map[String(gid)] = [];
    for (const row of (results as any[]) || []) {
      const gid = String(row.game_id);
      if (map[gid].length < perGame) {
        map[gid].push(row);
      }
    }
    c.header('Cache-Control', 'public, max-age=15, s-maxage=60, stale-while-revalidate=60');
    return c.json(map);
  } catch (e) {
    return c.json({ error: 'Failed to fetch batch updates' }, 500);
  }
});

// Debug route to catch unmatched API requests
app.all('/api/*', async (c) => {
  return c.json({ 
    error: 'Route not found',
    method: c.req.method,
    path: c.req.path,
    availableRoutes: ['/api/login', '/api/games', '/api/games/updates', '/api/games/:id', '/api/games/:id/updates']
  }, 404);
});

export default app;
