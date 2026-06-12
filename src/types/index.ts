/* ============================================
   TIPOS — Interfaces compartidas del sistema
   ============================================ */

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rut: string;
  role: UserRole;
  paso?: string;
  activo: boolean;
  ultimoAcceso: string;
}

export type UserRole = 'viajero' | 'aduanas' | 'sag' | 'pdi' | 'admin';

export interface MinorData {
  nombre: string;
  rut: string;
  edad: number;
  relacion: string;
  docAdjunto: boolean; // true = tiene autorización notarial cargada
}

export interface VehicleData {
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  tipo: string;
  propietario: string;
  rutPropietario: string;
  operacion: 'salida' | 'ingreso';
}

export interface SAGData {
  traeProductos: boolean;
  descripcion: string;
  items: string[];
}

export interface HistorialEntry {
  evento: string;
  fecha: string;
  actor: string;
}

export interface Tramite {
  id: string;
  viajero: {
    nombre: string;
    rut: string;
    email: string;
  };
  tipo: 'viaje' | 'vehiculo' | 'menor' | 'sag';
  estado: TramiteEstado;
  pasoFronterizo: string;
  fechaViaje: string;
  destino: string;
  motivo: string;
  acompanantes: { nombre: string; rut: string; parentesco: string }[];
  menores: MinorData[];
  vehiculo: VehicleData | null;
  declaracionSAG: SAGData | null;
  documentos: string[];
  historial: HistorialEntry[];
  observaciones: string;
  prioridad: 'normal' | 'urgente';
  fechaCreacion: string;
}

export type TramiteEstado =
  | 'borrador'
  | 'pendiente'
  | 'en-revision'
  | 'aprobado'
  | 'rechazado'
  | 'pendiente-inspeccion';

export interface AlertaPDI {
  rut: string;
  nombre: string;
  tipo: string;
  activo: boolean;
}

export interface AuditLog {
  id: number;
  usuario: string;
  accion: string;
  ip: string;
  fecha: string;
  tipo: 'login' | 'aprobacion' | 'rechazo' | 'administracion' | 'revision' | 'consulta';
}

export const ESTADO_CONFIG: Record<TramiteEstado, { label: string; colorClass: string }> = {
  'borrador':              { label: 'Borrador',                colorClass: 'badge--neutral' },
  'pendiente':             { label: 'Pendiente',               colorClass: 'badge--warning' },
  'en-revision':           { label: 'En revisión',             colorClass: 'badge--info' },
  'aprobado':              { label: 'Aprobado',                colorClass: 'badge--success' },
  'rechazado':             { label: 'Rechazado',               colorClass: 'badge--danger' },
  'pendiente-inspeccion':  { label: 'Pendiente de inspección', colorClass: 'badge--warning' },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  viajero: 'Viajero',
  aduanas: 'Func. Aduanas',
  sag: 'Func. SAG',
  pdi: 'Func. PDI',
  admin: 'Administrador',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  viajero: 'var(--color-role-viajero)',
  aduanas: 'var(--color-role-aduanas)',
  sag: 'var(--color-role-sag)',
  pdi: 'var(--color-role-pdi)',
  admin: 'var(--color-role-admin)',
};

export const PASOS_FRONTERIZOS = [
  'Los Libertadores (Mendoza)',
  'Chacalluta (Arica)',
  'Cardenal Samoré (Osorno)',
  'Pino Hachado (Lonquimay)',
  'Colchane (Colchane)',
  'Jama (San Pedro de Atacama)',
  'Sico (Antofagasta)',
  'San Francisco (Copiapó)',
  'Pehuenche (Talca)',
];
