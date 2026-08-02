const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wsepvjvilzcvbfvkuqdv.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_inaq4OVofoAbC6yM6e0rpg_MRJO3_lY';

if (!window.supabase?.createClient) {
  throw new Error('Supabase client library was not loaded');
}

export const supabase = window.supabase.createClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
