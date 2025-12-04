import { createClient } from "@supabase/supabase-js";

// These would normally come from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "your-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Type-safe helper for calling edge functions
export async function invokeFunction<T = unknown>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error"),
    };
  }
}
