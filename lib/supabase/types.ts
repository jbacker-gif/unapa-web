export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string
          category_id: string | null
          cover_image_url: string | null
          cover_storage_path: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body: string
          category_id?: string | null
          cover_image_url?: string | null
          cover_storage_path?: string | null
          excerpt?: string | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      events: {
        Row: {
          author_id: string | null
          body: string | null
          category_id: string | null
          cover_image_url: string | null
          cover_storage_path: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          published_at: string | null
          slug: string
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          cover_storage_path?: string | null
          description?: string | null
          ends_at?: string | null
          location?: string | null
          published_at?: string | null
          slug: string
          starts_at: string
          status?: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      documents: {
        Row: {
          author_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          file_name: string | null
          file_url: string
          id: string
          mime_type: string
          published_at: string | null
          sort_order: number
          status: string
          storage_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          description?: string | null
          file_name?: string | null
          file_url: string
          mime_type?: string
          published_at?: string | null
          sort_order?: number
          status?: string
          storage_path?: string | null
          title: string
        }
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      media_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_by?: string | null
          description?: string | null
          name: string
          slug: string
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['media_categories']['Insert']>
      }
      photos: {
        Row: {
          alt_text: string | null
          author_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          published_at: string | null
          sort_order: number
          status: string
          storage_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          author_id?: string | null
          category_id?: string | null
          description?: string | null
          image_url?: string | null
          published_at?: string | null
          sort_order?: number
          status?: string
          storage_path?: string | null
          title: string
        }
        Update: Partial<Database['public']['Tables']['photos']['Insert']>
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          role: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          position?: string | null
          role?: string
        }
        Update: {
          bio?: string | null
          full_name?: string | null
          phone?: string | null
          position?: string | null
          role?: string
        }
      }
      videos: {
        Row: {
          author_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          provider: string | null
          published_at: string | null
          sort_order: number
          status: string
          storage_path: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          description?: string | null
          duration_seconds?: number | null
          provider?: string | null
          published_at?: string | null
          sort_order?: number
          status?: string
          storage_path?: string | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['videos']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      current_app_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_content_manager: { Args: never; Returns: boolean }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
