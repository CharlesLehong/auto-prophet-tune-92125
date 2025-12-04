// Database types for Supabase
// These would be auto-generated from your Supabase schema

export interface Database {
  public: {
    Tables: {
      forecasts: {
        Row: {
          id: string;
          user_id: string;
          model_type: string;
          config: Record<string, unknown>;
          results: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["forecasts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["forecasts"]["Insert"]>;
      };
      saved_models: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          model_config: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_models"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["saved_models"]["Insert"]>;
      };
    };
    Functions: {
      // Add any database functions here
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
