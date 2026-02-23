import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qgarxjpyitjznaovznrc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnYXJ4anB5aXRqem5hb3Z6bnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTU5NTIsImV4cCI6MjA4NzQzMTk1Mn0.8-bbvqU9OqpAr7BHXL7_Et80g7TpM9qjK6GKtnhKhJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
