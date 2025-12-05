import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
    return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};

// Fallback object to prevent crashes if accessed unguarded, 
// though UI should prevent this.
const fallbackClient = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
        signUp: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
        signOut: async () => ({ error: null })
    },
    from: () => ({ select: () => ({}) }),
    channel: () => ({ on: () => ({ subscribe: () => {} }), send: () => {} }),
    removeChannel: () => {}
};

export const supabase = isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (fallbackClient as any);