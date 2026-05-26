import { createClient } from '@supabase/supabase-js';

let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcGFjbXBhZG1ybnR6eWp2dWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Njc5MjMsImV4cCI6MjA5NTM0MzkyM30.vqKMH8HioBdjbVLHcqAtz_rdwpjxnNfza90EMAlIBpA';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfpacmpadmrntzyjvufy.supabase.co';
try {
  // Try to clean and validate the URL
  const cleanedUrl = typeof rawUrl === 'string' ? rawUrl.replace(/["']/g, '').trim() : '';
  new URL(cleanedUrl);
  if(cleanedUrl) {
    supabaseUrl = cleanedUrl;
  }
} catch (e) {
  console.error('Malformed Supabase URL provided:', rawUrl, 'Falling back to placeholder.');
}

if (typeof supabaseAnonKey === 'string') {
  supabaseAnonKey = supabaseAnonKey.replace(/["']/g, '').trim();
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
