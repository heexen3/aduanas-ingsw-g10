import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Check, X, Shield, AlertOctagon, UserCheck, UserX } from 'lucide-react';
import { ALERTAS_PDI } from '../../data/seed';

export function PortalPDI() {
  const { tramites, actualizarEstado, agregarAuditLog } = useTramites();
  const { user } = useAuth();
  const [rutSearch, setRutSearch] = useState('');
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [alerta, setAlerta] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutSearch.trim()) return;

    setSearched(true);
    setFeedbackMsg('');

    // Check alerts in SEED
    const alertaEncontrada = ALERTAS_PDI.find(a => a.rut === rutSearch.trim() && a.activo);

    if (alertaEncontrada) {
      setAlerta(alertaEncontrada);
      setAuditResult({
        nombre: alertaEncontrada.nombre,
        rut: alertaEncontrada.rut,
        estadoCivil: 'Soltero',
        nacionalidad: 'Chilena',
        vigenciaDocumento: 'Vigente',
      });
      // Inscribir en bitácora de auditoría automáticamente
      if (user) {
        agregarAuditLog({
          usuario: user.nombre,
          ip: '192.168.2.19',
          accion: `ALERTA CRÍTICA PDI: Consulta RUN ${rutSearch} arrojó orden de arraigo nacional.`,
          fecha: new Date().toLocaleDateString('es-CL'),
          tipo: 'consulta'
        });
      }
    } else {
      setAlerta(null);
      // Buscar si tiene algún trámite en curso
      const tramiteViajero = tramites.find(t => t.viajero.rut === rutSearch.trim());
      setAuditResult({
        nombre: tramiteViajero ? tramiteViajero.viajero.nombre : 'Ciudadano Sin Registro Prev.',
        rut: rutSearch.trim(),
        estadoCivil: 'Casado/a',
        nacionalidad: 'Chilena',
        vigenciaDocumento: 'Vigente',
        tramiteId: tramiteViajero?.id
      });
      if (user) {
        agregarAuditLog({
          usuario: user.nombre,
          ip: '192.168.2.19',
          accion: `PDI: Consulta de control migratorio para RUN ${rutSearch}.`,
          fecha: new Date().toLocaleDateString('es-CL'),
          tipo: 'consulta'
        });
      }
    }
  };

  const handleResolverPDI = (estado: 'aprobado' | 'rechazado') => {
    if (!auditResult || !user) return;
    setSubmitting(true);

    setTimeout(() => {
      if (auditResult.tramiteId) {
        actualizarEstado(
          auditResult.tramiteId,
          estado,
          estado === 'aprobado' ? 'Control migratorio PDI aprobado' : 'Control migratorio PDI rechazado por oficial de turno',
          user.nombre
        );
      }
      agregarAuditLog({
        usuario: user.nombre,
        ip: '192.168.2.19',
        accion: `${estado === 'aprobado' ? 'Aprobó' : 'Rechazó'} control migratorio de ${auditResult.nombre} (RUN: ${auditResult.rut})`,
        fecha: new Date().toLocaleDateString('es-CL'),
        tipo: estado === 'aprobado' ? 'aprobacion' : 'rechazo'
      });
      setFeedbackMsg(`Control migratorio registrado como ${estado.toUpperCase()} para ${auditResult.nombre}.`);
      setSubmitting(false);
      setSearched(false);
      setAuditResult(null);
      setRutSearch('');
    }, 800);
  };

  return (
    <div className="portal-funcionarios" style={{ gridTemplateColumns: '1fr' }}>
      <div className="card" style={{ maxWidth: '44rem', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
          <Shield size={24} color="var(--color-role-pdi)" />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Control de Policía de Investigaciones (PDI)
          </h2>
        </div>

        {/* Buscador de RUN */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              value={rutSearch}
              onChange={e => setRutSearch(e.target.value)}
              placeholder="Ingrese RUN del viajero (Ej: 11.111.111-1)..."
              className="input"
              style={{ paddingLeft: '32px' }}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary">
            Consultar RUN
          </button>
        </form>

        {feedbackMsg && (
          <div className="alert alert--success animate-fadeIn" style={{ marginBottom: 'var(--space-4)' }}>
            <UserCheck size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {searched && auditResult && (
          <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Pop-up / Alerta Roja Crítica de Arraigo */}
            {alerta && (
              <div className="alert alert--danger animate-slideIn" style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-5)', border: '2px solid var(--color-danger)' }}>
                <AlertOctagon size={36} style={{ flexShrink: 0, color: 'var(--color-danger-text)' }} />
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-danger-text)' }}>
                    ALERTA: ARRAIGO NACIONAL VIGENTE
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', marginTop: '2px', color: 'var(--color-danger-text)' }}>
                    Orden judicial vigente decretada. Queda prohibida la salida del territorio nacional del ciudadano <strong>{auditResult.nombre}</strong>.
                  </p>
                  <p style={{ fontSize: '10px', marginTop: '6px', fontWeight: 600 }}>
                    Procedimiento PDI: Retener documentación de viaje y notificar de inmediato al supervisor de turno en frontera.
                  </p>
                </div>
              </div>
            )}

            {/* Ficha Ciudadano */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.35)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', marginBottom: '8px' }}>
                Ficha de Control Migratorio
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <div><strong>Nombre:</strong> {auditResult.nombre}</div>
                <div><strong>RUN:</strong> {auditResult.rut}</div>
                <div><strong>Nacionalidad:</strong> {auditResult.nacionalidad}</div>
                <div><strong>Cédula Identidad:</strong> {auditResult.vigenciaDocumento}</div>
                {auditResult.tramiteId && (
                  <div style={{ gridColumn: 'span 2', marginTop: '4px', fontWeight: 600, color: 'var(--color-primary-light)' }}>
                    Trámite Asociado Encontrado: {auditResult.tramiteId}
                  </div>
                )}
              </div>
            </div>

            {/* Panel de Decisiones */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                type="button"
                onClick={() => handleResolverPDI('aprobado')}
                disabled={alerta !== null || submitting}
                className="btn btn--success"
                style={{ flex: 1 }}
              >
                <UserCheck size={16} /> Registrar Cruce Autorizado
              </button>
              <button
                type="button"
                onClick={() => handleResolverPDI('rechazado')}
                disabled={submitting}
                className="btn btn--primary"
                style={{ flex: 1, background: 'var(--color-danger)' }}
              >
                <UserX size={16} /> Denegar Salida / Cruce
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
