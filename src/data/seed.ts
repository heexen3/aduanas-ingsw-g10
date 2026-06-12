/* ============================================
   DATOS SEED — Datos de demostración del sistema
   ============================================ */
import type { User, Tramite, AlertaPDI, AuditLog } from '../types';

export const SEED_USERS: User[] = [
  { id: 'USR-001', nombre: 'Juan Rodríguez Soto',  email: 'viajero@aduanas.cl',     password: 'viajero123', rut: '12.345.678-9',  role: 'viajero', activo: true, ultimoAcceso: 'Hoy 15:42' },
  { id: 'USR-002', nombre: 'Felipe Ortega',        email: 'funcionario@aduanas.cl',  password: 'func123',    rut: '14.567.890-1',  role: 'aduanas', paso: 'Los Libertadores', activo: true, ultimoAcceso: 'Hoy 14:20' },
  { id: 'USR-003', nombre: 'Sara González',         email: 'sag@aduanas.cl',          password: 'sag123',     rut: '15.678.901-2',  role: 'sag',     paso: 'Chacalluta', activo: true, ultimoAcceso: 'Hoy 13:05' },
  { id: 'USR-004', nombre: 'Pablo Moreno',          email: 'pdi@aduanas.cl',          password: 'pdi123',     rut: '16.789.012-3',  role: 'pdi',     paso: 'Los Libertadores', activo: true, ultimoAcceso: 'Hoy 11:15' },
  { id: 'USR-005', nombre: 'Admin Sistema',         email: 'admin@aduanas.cl',        password: 'admin123',   rut: '10.000.000-0',  role: 'admin',   activo: true, ultimoAcceso: 'Hoy 16:00' },
];

export const SEED_TRAMITES: Tramite[] = [
  {
    id: 'ADN-2026-1001',
    viajero: { nombre: 'María González', rut: '9.876.543-2', email: 'maria@email.com' },
    tipo: 'viaje', estado: 'aprobado', pasoFronterizo: 'Los Libertadores (Mendoza)',
    fechaViaje: '10 Jun 2026', destino: 'Mendoza, Argentina', motivo: 'Turismo',
    acompanantes: [{ nombre: 'Pedro González', rut: '9.876.544-0', parentesco: 'Cónyuge' }],
    menores: [], vehiculo: null, declaracionSAG: { traeProductos: false, descripcion: '', items: [] },
    documentos: ['Cédula de identidad ✓', 'Declaración SAG ✓', 'Formulario de viaje ✓'],
    historial: [
      { evento: 'Solicitud registrada', fecha: '10 Jun 2026 · 08:14', actor: 'Sistema' },
      { evento: 'Documentación validada', fecha: '10 Jun 2026 · 08:15', actor: 'Sistema PDI' },
      { evento: 'Declaración SAG aprobada', fecha: '10 Jun 2026 · 08:22', actor: 'Sara González' },
      { evento: 'Trámite aprobado', fecha: '10 Jun 2026 · 08:31', actor: 'Felipe Ortega' },
    ],
    observaciones: '', prioridad: 'normal', fechaCreacion: '10 Jun 2026 · 08:14',
  },
  {
    id: 'ADN-2026-1002',
    viajero: { nombre: 'Carlos Muñoz', rut: '15.234.876-K', email: 'carlos@email.com' },
    tipo: 'vehiculo', estado: 'en-revision', pasoFronterizo: 'Chacalluta (Arica)',
    fechaViaje: '12 Jun 2026', destino: 'Tacna, Perú', motivo: 'Turismo',
    acompanantes: [], menores: [],
    vehiculo: { patente: 'ABCD-12', marca: 'Toyota', modelo: 'Hilux', anio: '2021', color: 'Blanco', tipo: 'Camioneta / SUV', propietario: 'Carlos Muñoz', rutPropietario: '15.234.876-K', operacion: 'salida' },
    declaracionSAG: null,
    documentos: ['Cédula de identidad ✓', 'Formulario vehicular ✓', 'Revisión física (pendiente)'],
    historial: [
      { evento: 'Solicitud registrada', fecha: '12 Jun 2026 · 09:45', actor: 'Sistema' },
      { evento: 'Datos del vehículo validados', fecha: '12 Jun 2026 · 09:46', actor: 'Sistema' },
      { evento: 'Revisión física asignada', fecha: '12 Jun 2026 · 10:02', actor: 'Sistema' },
    ],
    observaciones: '', prioridad: 'urgente', fechaCreacion: '12 Jun 2026 · 09:45',
  },
  {
    id: 'ADN-2026-1003',
    viajero: { nombre: 'Sofía Castro', rut: '18.765.432-1', email: 'sofia@email.com' },
    tipo: 'menor', estado: 'pendiente', pasoFronterizo: 'Pino Hachado (Lonquimay)',
    fechaViaje: '15 Jun 2026', destino: 'Neuquén, Argentina', motivo: 'Visita familiar',
    acompanantes: [],
    menores: [{ nombre: 'Matías Castro', rut: '22.345.678-9', edad: 8, relacion: 'Hijo', docAdjunto: false }],
    vehiculo: null, declaracionSAG: null,
    documentos: ['Cédula de identidad ✓', 'Autorización notarial (pendiente)'],
    historial: [
      { evento: 'Solicitud registrada', fecha: '13 Jun 2026 · 14:30', actor: 'Sofía Castro' },
      { evento: 'Autorización notarial pendiente', fecha: '13 Jun 2026 · 14:30', actor: 'Sistema' },
    ],
    observaciones: '', prioridad: 'urgente', fechaCreacion: '13 Jun 2026 · 14:30',
  },
  {
    id: 'ADN-2026-1004',
    viajero: { nombre: 'Andrés Vega', rut: '11.456.789-3', email: 'andres@email.com' },
    tipo: 'viaje', estado: 'pendiente', pasoFronterizo: 'Los Libertadores (Mendoza)',
    fechaViaje: '16 Jun 2026', destino: 'San Juan, Argentina', motivo: 'Negocios',
    acompanantes: [{ nombre: 'Laura Vega', rut: '11.456.790-7', parentesco: 'Cónyuge' }],
    menores: [], vehiculo: null,
    declaracionSAG: { traeProductos: true, descripcion: '3 Manzanas y artesanías de madera', items: ['frutas', 'madera'] },
    documentos: ['Cédula de identidad ✓', 'Declaración SAG ✓'],
    historial: [
      { evento: 'Solicitud registrada', fecha: '14 Jun 2026 · 11:00', actor: 'Sistema' },
      { evento: 'Declaración SAG con productos regulados', fecha: '14 Jun 2026 · 11:05', actor: 'Andrés Vega' },
    ],
    observaciones: '', prioridad: 'normal', fechaCreacion: '14 Jun 2026 · 11:00',
  },
  {
    id: 'ADN-2026-1005',
    viajero: { nombre: 'Patricia Ríos', rut: '8.123.456-7', email: 'patricia@email.com' },
    tipo: 'viaje', estado: 'rechazado', pasoFronterizo: 'Colchane (Colchane)',
    fechaViaje: '8 Jun 2026', destino: 'La Paz, Bolivia', motivo: 'Turismo',
    acompanantes: [], menores: [], vehiculo: null,
    declaracionSAG: { traeProductos: false, descripcion: '', items: [] },
    documentos: ['Cédula de identidad ✓', 'Pasaporte (borroso)'],
    historial: [
      { evento: 'Solicitud registrada', fecha: '8 Jun 2026 · 10:00', actor: 'Sistema' },
      { evento: 'Trámite rechazado', fecha: '8 Jun 2026 · 13:30', actor: 'Lucía Fuentes' },
    ],
    observaciones: 'Pasaporte borroso, se solicita re-adjuntar scan en alta resolución.',
    prioridad: 'normal', fechaCreacion: '8 Jun 2026 · 10:00',
  },
];

export const ALERTAS_PDI: AlertaPDI[] = [
  { rut: '11.111.111-1', nombre: 'Roberto Ejemplo Sánchez', tipo: 'Arraigo Nacional Vigente', activo: true },
  { rut: '22.222.222-2', nombre: 'Claudia Ejemplo Pérez', tipo: 'Orden de No Innovar', activo: true },
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: 1, usuario: 'Felipe Ortega',  accion: 'Aprobó solicitud ADN-2026-1001',                ip: '192.168.1.45', fecha: '10 Jun 2026 · 08:31', tipo: 'aprobacion' },
  { id: 2, usuario: 'Admin Sistema',  accion: 'Creó usuario: Pablo Moreno (Func. PDI)',         ip: '192.168.1.1',  fecha: '10 Jun 2026 · 14:00', tipo: 'administracion' },
  { id: 3, usuario: 'Sara González',  accion: 'Inspeccionó declaración SAG-2026-0844',          ip: '192.168.1.67', fecha: '10 Jun 2026 · 13:30', tipo: 'revision' },
  { id: 4, usuario: 'Lucía Fuentes',  accion: 'Rechazó solicitud ADN-2026-1005',                ip: '192.168.1.89', fecha: '8 Jun 2026 · 13:30',  tipo: 'rechazo' },
  { id: 5, usuario: 'Pablo Moreno',   accion: 'Validó identidad RUT 12.345.678-9 vía PDI',     ip: '192.168.1.90', fecha: '10 Jun 2026 · 10:45', tipo: 'consulta' },
];

/** Genera un ID de trámite único */
export function generarIdTramite(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `ADN-2026-${num}`;
}

/** Genera timestamp legible */
export function ahora(): string {
  const d = new Date();
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()} · ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}
