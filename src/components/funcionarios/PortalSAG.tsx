import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Check, X, Leaf, AlertTriangle, Calendar, Info } from 'lucide-react';
import { ESTADO_CONFIG } from '../../types';

export function PortalSAG() {
  const { tramites, actualizarEstado, agregarAuditLog } = useTramites();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [observacion, setObservacion] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [error, setError] = useState('');

  // Filtrar solo los trámites que tienen declaración del SAG registrada
  const sagTramites = tramites.filter(t => t.declaracionSAG !== null);

  // Filtrar por búsqueda
  const filteredTramites = sagTramites.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.viajero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.viajero.rut.includes(searchTerm)
  );

  const activeTramite = selectedId
    ? filteredTramites.find(t => t.id === selectedId)
    : filteredTramites[0];

  const handleAprobar = () => {
    if (!activeTramite || !user) return;
    actualizarEstado(activeTramite.id, 'aprobado', 'Declaración fitosanitaria verificada sin hallazgos de riesgo.', user.nombre);
    agregarAuditLog({
      usuario: user.nombre,
      accion: `Aprobó declaración SAG ${activeTramite.id}`,
      ip: '192.168.2.14',
      fecha: new Date().toLocaleDateString('es-CL'),
      tipo: 'aprobacion'
    });
    setObservacion('');
    setShowRejectForm(false);
  };

  const handleRechazar = () => {
    if (!activeTramite || !user) return;
    if (!observacion.trim()) {
      setError('Debe indicar un motivo de rechazo o retención fitosanitaria obligatorio.');
      return;
    }
    actualizarEstado(activeTramite.id, 'rechazado', observacion, user.nombre);
    agregarAuditLog({
      usuario: user.nombre,
      accion: `Decomisó/Rechazó declaración SAG ${activeTramite.id} - Obs: ${observacion}`,
      ip: '192.168.2.14',
      fecha: new Date().toLocaleDateString('es-CL'),
      tipo: 'rechazo'
    });
    setObservacion('');
    setShowRejectForm(false);
    setError('');
  };

  return (
    <div className="portal-funcionarios">
      {/* Columna Izquierda: Bandeja SAG */}
      <div className="portal-funcionarios__list">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
          <Leaf size={18} color="var(--color-success)" />
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>
            Inspección Fitosanitaria (SAG)
          </h3>
        </div>

        {/* Buscador */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por RUN, ID o Nombre..."
            className="input"
            style={{ paddingLeft: '32px' }}
          />
        </div>

        {/* Lista de Trámites SAG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '440px', overflowY: 'auto' }}>
          {filteredTramites.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              No se registran pre-declaraciones SAG.
            </div>
          ) : (
            filteredTramites.map(t => {
              const active = activeTramite?.id === t.id;
              const hasAlert = t.declaracionSAG?.traeProductos;
              const conf = ESTADO_CONFIG[t.estado];
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedId(t.id);
                    setShowRejectForm(false);
                    setError('');
                  }}
                  className={`tramite-item ${active ? 'tramite-item--active' : ''}`}
                  style={hasAlert && t.estado !== 'aprobado' && t.estado !== 'rechazado' ? { borderLeft: '3px solid var(--color-warning)' } : {}}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>{t.id}</span>
                    <span className={`badge ${conf.colorClass}`}>{conf.label}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{t.viajero.nombre}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: hasAlert ? 'var(--color-warning-text)' : 'inherit' }}>
                      {hasAlert ? '⚠️ Productos declarados' : '✓ Canal Verde'}
                    </span>
                    <span>{t.fechaViaje}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Columna Derecha: Detalle e Inspección */}
      <div className="portal-funcionarios__detail">
        {activeTramite && activeTramite.declaracionSAG ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Inspección SAG Silvoagropecuaria
                </span>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>{activeTramite.id}</h2>
              </div>
              <span className={`badge ${ESTADO_CONFIG[activeTramite.estado].colorClass}`}>{ESTADO_CONFIG[activeTramite.estado].label}</span>
            </div>

            {/* Alerta fitosanitaria */}
            {activeTramite.declaracionSAG.traeProductos && (
              <div className="alert alert--warning animate-fadeIn">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Alerta de Productos Regulados:</strong>
                  <p style={{ marginTop: '2px', fontSize: '11px' }}>
                    El ciudadano declaró portar productos de riesgo. Se requiere realizar una inspección física e inspeccionar equipajes.
                  </p>
                </div>
              </div>
            )}

            {/* Datos Personales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
              <div>
                <strong>Viajero Solicitante:</strong>
                <p>{activeTramite.viajero.nombre}</p>
                <p>RUN: {activeTramite.viajero.rut}</p>
              </div>
              <div>
                <strong>Paso Fronterizo asignado:</strong>
                <p>{activeTramite.pasoFronterizo}</p>
                <p>Fecha de Viaje: {activeTramite.fechaViaje}</p>
              </div>
            </div>

            {/* Detalle Declarado */}
            <div style={{ padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.35)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                Detalle de la Pre-Declaración Fitosanitaria
              </h4>
              {activeTramite.declaracionSAG.traeProductos ? (
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-warning-text)' }}>
                    Efectos declarados por el ciudadano:
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', marginTop: '4px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--color-border)', padding: 'var(--space-2)', borderRadius: '6px', color: 'var(--color-text-primary)' }}>
                    {activeTramite.declaracionSAG.descripcion}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-text)', fontWeight: 500 }}>
                  El viajero pre-declaró que no transporta ningún producto de origen vegetal/animal ni artesanías de madera.
                </p>
              )}
            </div>

            {/* Historial */}
            <div className="portal-funcionarios__timeline-box">
              <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '4px' }}>Timeline del Trámite</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                {activeTramite.historial.map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{h.evento} ({h.actor})</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{h.fecha}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            {activeTramite.estado !== 'aprobado' && activeTramite.estado !== 'rechazado' && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                {!showRejectForm ? (
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button type="button" onClick={handleAprobar} className="btn btn--success" style={{ flex: 1 }}>
                      <Check size={16} /> Inspección Conforme (Aprobar)
                    </button>
                    <button type="button" onClick={() => setShowRejectForm(true)} className="btn btn--danger-outline" style={{ flex: 1 }}>
                      <X size={16} /> Decomisar / Rechazar
                    </button>
                  </div>
                ) : (
                  <div className="reject-panel animate-fadeIn">
                    <label className="label" style={{ color: 'var(--color-danger-text)', fontWeight: 600 }}>
                      Indique el motivo de decomiso o rechazo fitosanitario (Obligatorio)
                    </label>
                    <textarea
                      value={observacion}
                      onChange={e => {
                        setObservacion(e.target.value);
                        setError('');
                      }}
                      placeholder="Ej: Se decomisan 3 manzanas por presencia de mosca de la fruta. Acta #102..."
                      className="input"
                      rows={3}
                      style={{ resize: 'none' }}
                    />
                    {error && (
                      <div style={{ color: 'var(--color-danger-text)', fontSize: '11px', fontWeight: 600 }}>
                        {error}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button type="button" onClick={handleRechazar} className="btn btn--primary" style={{ background: 'var(--color-danger)', flex: 1 }}>
                        Confirmar Decomiso/Rechazo
                      </button>
                      <button type="button" onClick={() => setShowRejectForm(false)} className="btn btn--outline" style={{ flex: 1 }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Seleccione una pre-declaración de la bandeja para auditar su estado fitosanitario.
          </div>
        )}
      </div>
    </div>
  );
}
