// User type for authentication
export type User = {
  userid: string;
  email: string;
  role: string;
  [key: string]: unknown;
};

// Game update type
export type GameUpdate = {
  id: number;
  game_id: number;
  user_email: string;
  update_text: string;
  created_at: string;
};

// Extend Hono's ContextVariableMap
declare module 'hono' {
  interface ContextVariableMap {
    user?: User;
  }
}
