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
  '/api/games',
  '/login',
  '/logout',
  '/api/health'
];

// Auth middleware
app.use('*', async (c, next) => {
  const path = c.req.path;
  
  // Skip auth for public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return next();
  }
  
  console.log('🔐 Server Auth Check - Path:', path);
  
  // Check for token in Authorization header or cookie
  let token = '';
  const authHeader = c.req.header('Authorization');
  
  // Try to get token from Authorization header first
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('🔑 Server - Token found in Authorization header:', token.substring(0, 20) + '...');
  } 
  // Then try to get from cookies
  else if (c.req.raw.headers.has('cookie')) {
    const cookies = c.req.raw.headers.get('cookie') || '';
    console.log('🍪 Server - Cookies received:', cookies.substring(0, 100) + '...');
    const match = cookies.match(/auth=([^;]+)/);
    token = match ? match[1] : '';
    if (token) {
      console.log('🔑 Server - Token found in cookies:', token.substring(0, 20) + '...');
    }
  }
  
  // If no token found, redirect to login for web routes or return 401 for API
  if (!token) {
    console.error('❌ Server - No token found in request');
    if (path.startsWith('/api/')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    return c.redirect('/login');
  }
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('🔍 Server - JWT payload:', payload);
    
    // Ensure the payload has the expected shape
    const user = {
      userid: payload.userid as string,
      email: payload.email as string,
      role: payload.role as string,
      ...payload
    };
    c.set('user', user);
    console.log('✅ Server - Token verified successfully for user:', user.email);
  } catch (e) {
    console.error('❌ Server - Token verification failed:', e);
    console.error('❌ Server - Failed token was:', token.substring(0, 50) + '...');
    console.error('❌ Server - JWT_SECRET length:', JWT_SECRET.byteLength);
    
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
  } catch (e) {
    console.error('Error creating updates table:', e);
  }
  await next();
});

app.patch('/api/games/:id', async (c) => {
  console.log('🔧 PATCH endpoint hit for /api/games/:id');
  
  const id = c.req.param('id');
  console.log('🔢 Game ID from path param:', id);
  
  // Log request headers for debugging
  const authHeader = c.req.header('Authorization');
  console.log('🔑 Authorization header:', authHeader ? 'Present' : 'Missing');
  
  try {
    // Parse request body
    const body = await c.req.json();
    const { ehsScore, oppScore, updateText } = body;
    console.log('📊 Request body:', { ehsScore, oppScore, updateText: updateText || '(none)' });
    
    // Get user from context (set by auth middleware)
    const user = c.get('user');
    console.log('👤 User from context:', user ? `${user.email} (${user.role})` : 'Not found');
    
    // Validate user is authenticated
    if (!user) {
      console.error('❌ User not authenticated - returning 401');
      return c.json({ error: 'Unauthorized', detail: 'No user in context' }, 401);
    }
    
    const userEmail = user.email;
    console.log('✉️ User email for update:', userEmail);

    // Validate required fields
    if (!id) {
      console.error('❌ Missing game ID');
      return c.json({ error: 'Missing game ID' }, 400);
    }
    
    if (ehsScore === undefined || oppScore === undefined) {
      console.error('❌ Missing score values:', { ehsScore, oppScore });
      return c.json({ error: 'Missing required score fields' }, 400);
    }
    
    console.log('🔄 Preparing database statements for update');
    
    // Check if the game exists first
    const gameCheck = await c.env.DB.prepare(
      "SELECT id FROM games2025 WHERE id = ?"
    ).bind(id).first();
    
    if (!gameCheck) {
      console.error(`❌ Game with ID ${id} not found`);
      return c.json({ error: `Game with ID ${id} not found` }, 404);
    }

    const statements = [
      // Update game scores
      c.env.DB.prepare("UPDATE games2025 SET ehsScore = ?, oppScore = ? WHERE id = ?")
        .bind(ehsScore, oppScore, id)
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
    
    console.log('⚙️ Executing database batch update');
    // Execute all statements in a batch
    await c.env.DB.batch(statements);
    console.log('✅ Database update successful');

    // Fetch the latest updates to return
    const updatesResult = await c.env.DB.prepare(
      `SELECT * FROM game_updates 
       WHERE game_id = ? 
       ORDER BY created_at DESC`
    ).bind(id).all();
    
    console.log('📤 Returning success response with updates');
    return c.json({ 
      success: true, 
      message: `Game ${id} updated${updateText ? ' with note' : ''}.`,
      updates: updatesResult.results || []
    });
  } catch (e) {
    console.error('❌ Update Error:', e);
    return c.json({ 
      error: 'Failed to update game',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, 500);
  }
});

// Get updates for a game
app.get('/api/games/:id/updates', async (c) => {
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

// Debug route to catch unmatched API requests
app.all('/api/*', async (c) => {
  console.log('🔍 Unmatched API route:', c.req.method, c.req.path);
  return c.json({ 
    error: 'Route not found',
    method: c.req.method,
    path: c.req.path,
    availableRoutes: ['/api/login', '/api/games/:id', '/api/games/:id/updates']
  }, 404);
});

export default app;
