// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jshwrshynvrepdltmsur.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaHdyc2h5bnZyZXBkbHRtc3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTU1NzUsImV4cCI6MjA2MjI5MTU3NX0.Qmhv_0JDSwCJs5eh9m5jU3TxWWqQU1DBMZmQYR41UeU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);