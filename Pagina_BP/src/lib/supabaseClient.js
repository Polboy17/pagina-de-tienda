import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrcjbdydfewtwzlmulgc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2piZHlkZmV3dHd6bG11bGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjU3MTUsImV4cCI6MjA2MzEwMTcxNX0.koc_Alqv1sQZ5-DYRd75nOFgbik2rf2xI8zsr3BMRWE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


