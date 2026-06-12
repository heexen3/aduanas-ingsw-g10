import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Tramite, TramiteEstado, AuditLog } from '../types';
import { SEED_TRAMITES, SEED_AUDIT_LOGS, generarIdTramite, ahora } from '../data/seed';

interface TramitesState {
  tramites: Tramite[];
  auditLogs: AuditLog[];
  crearTramite: (data: Omit<Tramite, 'id' | 'fechaCreacion' | 'historial'>) => Tramite;
  actualizarEstado: (id: string, estado: TramiteEstado, observacion: string, actor: string) => void;
  getTramitesPorViajero: (rut: string) => Tramite[];
  getTramitesPorEstado: (estado: TramiteEstado) => Tramite[];
  agregarAuditLog: (log: Omit<AuditLog, 'id'>) => void;
}

const TramitesContext = createContext<TramitesState | null>(null);

const STORAGE_KEY_TRAMITES = 'aduanas_tramites';
const STORAGE_KEY_AUDIT = 'aduanas_audit';

export function TramitesProvider({ children }: { children: ReactNode }) {
  const [tramites, setTramites] = useState<Tramite[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRAMITES);
      return saved ? JSON.parse(saved) : SEED_TRAMITES;
    } catch { return SEED_TRAMITES; }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
      return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
    } catch { return SEED_AUDIT_LOGS; }
  });

  // Persistir cambios
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRAMITES, JSON.stringify(tramites));
  }, [tramites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const crearTramite = (data: Omit<Tramite, 'id' | 'fechaCreacion' | 'historial'>): Tramite => {
    const nuevo: Tramite = {
      ...data,
      id: generarIdTramite(),
      fechaCreacion: ahora(),
      historial: [{ evento: 'Solicitud registrada', fecha: ahora(), actor: 'Sistema' }],
    };
    setTramites(prev => [nuevo, ...prev]);
    return nuevo;
  };

  const actualizarEstado = (id: string, estado: TramiteEstado, observacion: string, actor: string) => {
    setTramites(prev => prev.map(t => {
      if (t.id !== id) return t;
      const eventoTexto =
        estado === 'aprobado' ? 'Trámite aprobado' :
        estado === 'rechazado' ? 'Trámite rechazado' :
        estado === 'en-revision' ? 'Trámite en revisión' :
        estado === 'pendiente-inspeccion' ? 'Derivado a inspección física' :
        `Estado cambiado a ${estado}`;
      return {
        ...t,
        estado,
        observaciones: observacion || t.observaciones,
        historial: [
          ...t.historial,
          { evento: eventoTexto + (observacion ? `: ${observacion}` : ''), fecha: ahora(), actor },
        ],
      };
    }));
  };

  const getTramitesPorViajero = (rut: string) =>
    tramites.filter(t => t.viajero.rut === rut);

  const getTramitesPorEstado = (estado: TramiteEstado) =>
    tramites.filter(t => t.estado === estado);

  const agregarAuditLog = (log: Omit<AuditLog, 'id'>) => {
    setAuditLogs(prev => [{ ...log, id: Date.now() }, ...prev]);
  };

  return (
    <TramitesContext.Provider value={{
      tramites,
      auditLogs,
      crearTramite,
      actualizarEstado,
      getTramitesPorViajero,
      getTramitesPorEstado,
      agregarAuditLog,
    }}>
      {children}
    </TramitesContext.Provider>
  );
}

export function useTramites(): TramitesState {
  const ctx = useContext(TramitesContext);
  if (!ctx) throw new Error('useTramites must be used inside TramitesProvider');
  return ctx;
}
