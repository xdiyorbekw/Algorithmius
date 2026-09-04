export type AppRole = 'admin' | 'editor';
export type AlgorithmLanguage = 'cpp' | 'python' | 'javascript' | 'typescript' | 'java' | 'go' | 'rust';

export type AlgorithmCodeRow = {
  id: string;
  algorithm_id: string;
  language: AlgorithmLanguage;
  code: string;
  created_at: string;
  updated_at: string;
};


export type Database = {
  public: {
    Tables: {
      algorithms: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ru: string;
          title_uz: string;
          description_en: string;
          description_ru: string;
          description_uz: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_en: string;
          title_ru: string;
          title_uz: string;
          description_en: string;
          description_ru: string;
          description_uz: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_en?: string;
          title_ru?: string;
          title_uz?: string;
          description_en?: string;
          description_ru?: string;
          description_uz?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [{
          foreignKeyName: 'algorithm_code_versions_algorithm_id_fkey';
          columns: ['id'];
          isOneToOne: false;
          referencedRelation: 'algorithm_code_versions';
          referencedColumns: ['algorithm_id'];
        }];
      };
      algorithm_code_versions: {
        Row: AlgorithmCodeRow;
        Insert: {
          id?: string;
          algorithm_id: string;
          language: AlgorithmLanguage;
          code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          algorithm_id?: string;
          language?: AlgorithmLanguage;
          code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [{
          foreignKeyName: 'algorithm_code_versions_algorithm_id_fkey';
          columns: ['algorithm_id'];
          isOneToOne: false;
          referencedRelation: 'algorithms';
          referencedColumns: ['id'];
        }];
      };
      profiles: {
        Row: { id: string; role: AppRole; created_at: string };
        Insert: { id: string; role?: AppRole; created_at?: string };
        Update: { id?: string; role?: AppRole; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      replace_algorithm_codes: {
        Args: { p_algorithm_id: string; p_codes: Record<string, string> };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      algorithm_language: AlgorithmLanguage;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
