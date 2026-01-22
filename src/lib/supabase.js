import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hkjyxvxczcugiyazegow.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhranl4dnhjemN1Z2l5YXplZ293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzQwNzgsImV4cCI6MjA4NDYxMDA3OH0.Vndh6S-jTzLP7_rCebNJ1rr-Dwu5DU8VX0HO6P2Qpio";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
