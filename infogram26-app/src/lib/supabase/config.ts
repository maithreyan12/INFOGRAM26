// ============================================================
// Supabase Configuration — INFOGRAM'26 Production Database
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fipoazwipiahfkttgwew.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bPsxXaerN_vmEGS0p8HRUQ_gpMCIfhF';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcG9hendpcGlhaGZrdHRnd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc5ODEsImV4cCI6MjEwMjQ2Mzk4MX0.lx-wiLCzg90mzsliCeYh5IvBOtwmHWs-dIL20fCQ3zA';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Public Supabase client for browser usage (Singleton)
const globalForSupabase = globalThis as unknown as {
  supabase?: any;
  supabaseAdmin?: any;
};

export const supabase: any =
  globalForSupabase.supabase ||
  createClient<any>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
    },
  });

// Admin Supabase client for API routes (bypasses RLS)
export const supabaseAdmin: any =
  globalForSupabase.supabaseAdmin ||
  createClient<any>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
  globalForSupabase.supabaseAdmin = supabaseAdmin;
}

export default supabase;
