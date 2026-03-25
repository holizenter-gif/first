export type Lead = {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
  quiz_id: string | null;
  puntaje: number | null;
  resultado: "bajo" | "riesgo" | "critico" | null;
  servicio_recomendado: string | null;
  estado_crm: "nuevo" | "contactado" | "diagnostico" | "propuesta" | "contrato" | "activo" | "perdido";
  created_at: string;
};

export type QuizResponse = {
  id: string;
  lead_id: string;
  quiz_type: "burnout" | "estres" | "satisfaccion" | "holistico";
  respuestas: Record<string, number>;
  puntaje_total: number;
  puntaje_cuerpo: number | null;
  puntaje_mente: number | null;
  puntaje_espiritu: number | null;
  created_at: string;
};

export type Profesional = {
  id: string;
  nombre: string;
  especialidad: string;
  bio: string;
  foto_url: string;
  modalidad: "presencial" | "online" | "hibrido";
  precio_base: number;
  comision_pct: number;
  activo: boolean;
  cal_username: string | null;
  tags: string[];
  experiencia_anos: number;
  created_at: string;
};

export type Cita = {
  id: string;
  tipo: "diagnostico_gratis" | "taller_grupal" | "sensibilizacion" | "integracion" | "sesion_individual";
  empresa_id: string | null;
  profesional_id: string | null;
  fecha: string;
  modalidad: "presencial" | "online" | "hibrido";
  status: "pendiente" | "confirmada" | "completada" | "cancelada";
  cal_event_id: string | null;
  pago_id: string | null;
  nombre_cliente: string | null;
  empresa_nombre: string | null;
  email_cliente: string | null;
  whatsapp_cliente: string | null;
  created_at: string;
};

export type Pago = {
  id: string;
  lead_id: string | null;
  servicio: string;
  monto: number;
  anticipo: number;
  estado: "pendiente" | "aprobado" | "rechazado" | "reembolsado";
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  nombre: string;
  empresa: string | null;
  email: string;
  whatsapp: string | null;
  created_at: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio_base: number;
  precio_max: number;
  duracion_horas: number;
  modalidades: ("presencial" | "online" | "hibrido")[];
  personas_min: number;
  personas_max: number;
};

// ─── MARKETPLACE ────────────────────────────────────────────

export type ProductoTipo = "curso_digital" | "material_fisico" | "merchandising" | "taller_grabado" | "membresia";

export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcion_larga: string;
  tipo: ProductoTipo;
  precio: number;
  precio_original?: number;
  moneda: "MXN";
  imagen_url: string;
  imagenes_extra: string[];
  activo: boolean;
  destacado: boolean;
  stock?: number;
  requiere_envio: boolean;
  peso_kg?: number;
  archivo_url?: string;
  duracion_horas?: number;
  nivel?: "basico" | "intermedio" | "avanzado";
  instructor?: string;
  incluye: string[];
  categoria_slug: string;
  tags: string[];
  stripe_price_id?: string;
  mp_preference_id?: string;
  created_at: string;
};

export type CategoriaTienda = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  icono: string;
  orden: number;
};

export type OrdenEstado = "pendiente" | "pagado" | "procesando" | "enviado" | "entregado" | "cancelado" | "reembolsado";

export type Orden = {
  id: string;
  user_id?: string;
  email_comprador: string;
  nombre_comprador: string;
  items: OrdenItem[];
  subtotal: number;
  costo_envio: number;
  total: number;
  moneda: "MXN";
  estado: OrdenEstado;
  metodo_pago: "mercado_pago" | "stripe" | "transferencia";
  pago_id?: string;
  direccion_envio?: DireccionEnvio;
  packlink_shipment_id?: string;
  guia_url?: string;
  notas?: string;
  created_at: string;
};

export type OrdenItem = {
  producto_id: string;
  nombre: string;
  tipo: ProductoTipo;
  precio: number;
  cantidad: number;
  imagen_url: string;
  archivo_url?: string;
};

export type DireccionEnvio = {
  nombre: string;
  calle: string;
  numero_ext: string;
  numero_int?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  cp: string;
  pais: "MX";
  telefono: string;
};

export type CarritoItem = {
  producto: Producto;
  cantidad: number;
};

export type Resena = {
  id: string;
  producto_id: string;
  nombre: string;
  rating: number;
  comentario: string;
  verificado: boolean;
  created_at: string;
};

export type Membresia = {
  id: string;
  user_id: string;
  plan: "mensual" | "anual";
  precio: number;
  estado: "activa" | "cancelada" | "vencida";
  fecha_inicio: string;
  fecha_renovacion: string;
  stripe_subscription_id?: string;
  beneficios: string[];
  created_at: string;
};
