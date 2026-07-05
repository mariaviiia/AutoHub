import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqrjtizmbeohqlwhcjxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcmp0aXptYmVvaHFsd2hjanhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMTAzODcsImV4cCI6MjA5Njc4NjM4N30.FIXs9TddES4N3si_Uaay9uNv7Hqb76jk1XxqFNfyMZw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
