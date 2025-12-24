import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.SUPABASE_URL);
// console.log(process.env.SUPABASE_SERVICE_KEY);

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// export const supabase = createClient(
//   "https://selmptggdbgwtqnqezot.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbG1wdGdnZGJnd3RxbnFlem90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzU2NDQsImV4cCI6MjA3Njk1MTY0NH0.jjgVYaBvomU5BEo3eJ_TMip9s552Ej2AI2ymwuW-FDo"
// );
// sbp_97eeee9abcfb8aebcad6f65b5221d1f5f023a71d
