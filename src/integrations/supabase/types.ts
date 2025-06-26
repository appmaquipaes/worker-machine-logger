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
      clients: {
        Row: {
          activo: boolean | null
          ciudad: string | null
          correo_electronico: string | null
          created_at: string | null
          direccion: string | null
          id: string
          nit_cedula: string | null
          nombre_cliente: string
          observaciones: string | null
          persona_contacto: string | null
          telefono_contacto: string | null
          tipo_cliente: string | null
          tipo_persona: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          ciudad?: string | null
          correo_electronico?: string | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          nit_cedula?: string | null
          nombre_cliente: string
          observaciones?: string | null
          persona_contacto?: string | null
          telefono_contacto?: string | null
          tipo_cliente?: string | null
          tipo_persona?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          ciudad?: string | null
          correo_electronico?: string | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          nit_cedula?: string | null
          nombre_cliente?: string
          observaciones?: string | null
          persona_contacto?: string | null
          telefono_contacto?: string | null
          tipo_cliente?: string | null
          tipo_persona?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fincas: {
        Row: {
          ciudad: string | null
          cliente_id: string | null
          contacto_nombre: string | null
          contacto_telefono: string | null
          created_at: string | null
          direccion: string | null
          id: string
          nombre_finca: string
          notas: string | null
          updated_at: string | null
        }
        Insert: {
          ciudad?: string | null
          cliente_id?: string | null
          contacto_nombre?: string | null
          contacto_telefono?: string | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          nombre_finca: string
          notas?: string | null
          updated_at?: string | null
        }
        Update: {
          ciudad?: string | null
          cliente_id?: string | null
          contacto_nombre?: string | null
          contacto_telefono?: string | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          nombre_finca?: string
          notas?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fincas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_acopio: {
        Row: {
          cantidad_disponible: number | null
          costo_promedio_m3: number | null
          id: string
          tipo_material: string
          updated_at: string | null
        }
        Insert: {
          cantidad_disponible?: number | null
          costo_promedio_m3?: number | null
          id?: string
          tipo_material: string
          updated_at?: string | null
        }
        Update: {
          cantidad_disponible?: number | null
          costo_promedio_m3?: number | null
          id?: string
          tipo_material?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      machines: {
        Row: {
          brand: string | null
          created_at: string | null
          id: string
          license_plate: string | null
          model: string | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string | null
          model?: string | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string | null
          model?: string | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          created_at: string | null
          id: string
          margen_ganancia: number | null
          nombre_material: string
          precio_venta_m3: number | null
          valor_por_m3: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          margen_ganancia?: number | null
          nombre_material: string
          precio_venta_m3?: number | null
          valor_por_m3: number
        }
        Update: {
          created_at?: string | null
          id?: string
          margen_ganancia?: number | null
          nombre_material?: string
          precio_venta_m3?: number | null
          valor_por_m3?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_machines: string[] | null
          comision_por_hora: number | null
          comision_por_viaje: number | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          assigned_machines?: string[] | null
          comision_por_hora?: number | null
          comision_por_viaje?: number | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          assigned_machines?: string[] | null
          comision_por_hora?: number | null
          comision_por_viaje?: number | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          cantidad_m3: number | null
          created_at: string | null
          description: string | null
          destination: string | null
          hours: number | null
          id: string
          kilometraje: number | null
          machine_id: string | null
          machine_name: string
          origin: string | null
          proveedor: string | null
          report_date: string
          report_type: string
          trips: number | null
          updated_at: string | null
          user_id: string | null
          user_name: string
          value: number | null
          work_site: string | null
        }
        Insert: {
          cantidad_m3?: number | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          hours?: number | null
          id?: string
          kilometraje?: number | null
          machine_id?: string | null
          machine_name: string
          origin?: string | null
          proveedor?: string | null
          report_date: string
          report_type: string
          trips?: number | null
          updated_at?: string | null
          user_id?: string | null
          user_name: string
          value?: number | null
          work_site?: string | null
        }
        Update: {
          cantidad_m3?: number | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          hours?: number | null
          id?: string
          kilometraje?: number | null
          machine_id?: string | null
          machine_name?: string
          origin?: string | null
          proveedor?: string | null
          report_date?: string
          report_type?: string
          trips?: number | null
          updated_at?: string | null
          user_id?: string | null
          user_name?: string
          value?: number | null
          work_site?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
