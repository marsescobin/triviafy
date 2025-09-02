import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ofokhogxkjwtujnpdhlm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mb2tob2d4a2p3dHVqbnBkaGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDk5MDAsImV4cCI6MjA3MTgyNTkwMH0.P4N2cs7UukxV9Xq6IgY4M7O1BPKnmmO1FA2lAq7DvUg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
