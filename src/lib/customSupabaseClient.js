import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txcsbtvcdaqmkjjbhbeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Y3NidHZjZGFxbWtqamJoYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjgwODEsImV4cCI6MjA3ODkwNDA4MX0.2rBJMtOx8Lldf1eyQ4Yvf-Kl5kurP77Ky_M1VYXcGR8';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
