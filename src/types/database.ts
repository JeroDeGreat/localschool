export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: "student" | "teacher" | "admin";
          department_id: string | null;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "student" | "teacher" | "admin";
          department_id?: string | null;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: "student" | "teacher" | "admin";
          department_id?: string | null;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string;
          color: string;
          emoji: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string;
          color?: string;
          emoji?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          color?: string;
          emoji?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      department_members: {
        Row: {
          id: string;
          department_id: string;
          user_id: string;
          role: "student" | "teacher" | "admin";
          joined_at: string;
        };
        Insert: {
          id?: string;
          department_id: string;
          user_id: string;
          role?: "student" | "teacher" | "admin";
          joined_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          user_id?: string;
          role?: "student" | "teacher" | "admin";
          joined_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          content: string;
          department_id: string | null;
          sender_id: string;
          reply_to: string | null;
          is_lobby: boolean;
          has_attachment: boolean;
          attachment_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          department_id?: string | null;
          sender_id: string;
          reply_to?: string | null;
          is_lobby?: boolean;
          has_attachment?: boolean;
          attachment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          department_id?: string | null;
          sender_id?: string;
          reply_to?: string | null;
          is_lobby?: boolean;
          has_attachment?: boolean;
          attachment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          department_id: string;
          created_by: string;
          due_date: string | null;
          points: number;
          file_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          department_id: string;
          created_by: string;
          due_date?: string | null;
          points?: number;
          file_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          department_id?: string;
          created_by?: string;
          due_date?: string | null;
          points?: number;
          file_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      help_requests: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          department_id: string | null;
          requester_id: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          points_reward: number;
          assigned_to: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          department_id?: string | null;
          requester_id: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          points_reward?: number;
          assigned_to?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          department_id?: string | null;
          requester_id?: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          points_reward?: number;
          assigned_to?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string;
          color: string | null;
          requirement: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon: string;
          color?: string | null;
          requirement?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          color?: string | null;
          requirement?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
