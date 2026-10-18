import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const INSTITUTION_NAME = 
  import.meta.env.VITE_INSTITUTION_NAME || 'D. Y. Patil College of Engineering & Technology';

export const PLATFORM_NAME = 
  import.meta.env.VITE_PLATFORM_NAME || 'DY Patil TechVerse';

export const ALLOWED_EMAIL_DOMAINS = (
  import.meta.env.VITE_ALLOWED_EMAIL_DOMAINS || 
  'dypatil.edu,dypatilpune.edu,dypatilkolhapur.edu,dypiemr.ac.in,dypvp.edu.in'
).split(',').map((d: string) => d.trim().toLowerCase());

/**
 * Validates whether real Supabase credentials are configured in the environment.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your-anon-public')) return false;
  try {
    const url = new URL(supabaseUrl);
    return url.protocol === 'https:' && url.hostname.includes('supabase');
  } catch {
    return false;
  }
}

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
