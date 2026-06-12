import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Check, X, FileText, AlertCircle, Calendar, MapPin, User, Car } from 'lucide-react';
import { ESTADO_CONFIG } from '../../types';

export function PortalAduanas() {
  const { tramites, actualizarEstado, agregarAuditLog } = useTramites();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [observacion, setObservacion] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [error, setError] = useState('');

  // KPIs dinámicos
  const total = tramites.length;
  const pendientes = tramites.filter(t => t.estado === 'pendiente').length;
  const revision = tramites.filter(t => t.estado === 'en-revision').length;
  const aprobados = tramites.filter(t => t.estado === 'aprobado').length;
  const rechazados = tramites.filter(t => t.estado === 'rechazado').length;

  // Filtrar
  const filteredTramites = tramites.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.viajero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.viajero.rut.includes(searchTerm);
    
    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && t.estado === statusFilter;
  });

  const activeTramite = selectedId
    ? filteredTramites.find(t => t.id === selectedId)
    : filteredTramites[0];

  const handleAprobar = () => {
    if (!activeTramite || !user) return;
    actualizarEstado(activeTramite.id, 'aprobado', 'Documentos aduaneros verificados conformes.', user.nombre);
    agregarAuditLog({
      usuario: user.nombre,
      accion: `Aprobó trámite ${activeTramite.id}`,
      ip: '192.168.2.11',
      fecha: new Date().toLocaleDateString('es-CL'),
      tipo: 'aprobacion'
    });
    setObservacion('');
    setShowRejectForm(false);
  };

  const handleRechazar = () => {
    if (!activeTramite || !user) return;
    if (!observacion.trim()) {
      setError('Debe indicar un motivo de rechazo obligatorio.');
      return;
    }
    actualizarEstado(activeTramite.id, 'rechazado', observacion, user.nombre);
    agregarAuditLog({
      usuario: user.nombre,
      accion: `Rechazó trámite ${activeTramite.id} - Obs: ${observacion}`,
      ip: '192.168.2.11',
      fecha: new Date().toLocaleDateString('es-CL'),
      tipo: 'rechazo'
    });
    setObservacion('');
    setShowRejectForm(false);
    setError('');
  };

  return (
    <div className="portal-funcionarios">
      {/* Columna Izquierda: Búsqueda y Lista */}
      <div className="portal-funcionarios__list">
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>
          Bandeja de Control Aduanero
        </h3>

        {/* KPIs de Bandeja */}
        <div className="portal-funcionarios__kpi-row">
          <div className="func-kpi">
            <div className="func-kpi__val">{pendientes}</div>
            <div className="func-kpi__lbl">Pendientes</div>
          </div>
          <div className="func-kpi">
            <div className="func-kpi__val">{revision}</div>
            <div className="func-kpi__lbl">En Revisión</div>
          </div>
          <div className="func-kpi">
            <div className="func-kpi__val">{aprobados}</div>
            <div className="func-kpi__lbl">Aprobados</div>
          </div>
          <div className="func-kpi">
            <div className="func-kpi__val">{rechazados}</div>
            <div className="func-kpi__lbl">Rechazados</div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
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
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input" style={{ width: '120px' }}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="en-revision">En Revisión</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredTramites.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              No hay solicitudes pendientes en esta categoría.
            </div>
          ) : (
            filteredTramites.map(t => {
              const active = activeTramite?.id === t.id;
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
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>{t.id}</span>
                    <span className={`badge ${conf.colorClass}`}>{conf.label}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{t.viajero.nombre}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                    <span>{t.pasoFronterizo.split(' ')[0]}</span>
                    <span>{t.fechaViaje}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Columna Derecha: Detalle y Acciones */}
      <div className="portal-funcionarios__detail">
        {activeTramite ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Solicitud en Revisión Aduanera
                </span>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>{activeTramite.id}</h2>
              </div>
              <span className={`badge ${ESTADO_CONFIG[activeTramite.estado].colorClass}`}>{ESTADO_CONFIG[activeTramite.estado].label}</span>
            </div>

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
                <p>Destino: {activeTramite.destino}</p>
              </div>
            </div>

            {/* Acompañantes y menores */}
            {(activeTramite.acompanantes.length > 0 || activeTramite.menores.length > 0) && (
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px' }}>Grupo Familiar e Infantes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeTramite.acompanantes.map((a, i) => (
                    <div key={i} style={{ padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{a.nombre} ({a.rut})</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{a.parentesco}</span>
                    </div>
                  ))}
                  {activeTramite.menores.map((m, i) => (
                    <div key={i} style={{ padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', background: 'var(--color-primary-bg)' }}>
                      <span>👶 {m.nombre} ({m.rut}) - {m.edad} años ({m.relacion})</span>
                      <span style={{ color: 'var(--color-success-text)', fontWeight: 600 }}>
                        {m.docAdjunto ? '✓ Autorización Notarial Adjunta' : '❌ Sin Autorización'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehículo particular */}
            {activeTramite.vehiculo && (
              <div style={{ padding: 'var(--space-3)', background: '#fafbfe', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Car size={12} /> Vehículo Registrado
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Patente</span>
                    <p style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{activeTramite.vehiculo.patente}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Propietario</span>
                    <p>{activeTramite.vehiculo.propietario}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Padrón</span>
                    <p style={{ color: 'var(--color-success-text)', fontWeight: 600 }}>✓ Adjunto en carpeta</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documentos Digitalizados */}
            <div>
              <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px' }}>Documentación Adjunta</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '4px' }}>
                {activeTramite.documentos.map((d, i) => (
                  <div key={i} style={{ padding: '4px 8px', background: '#f8fafc', borderRadius: '4px', fontSize: '11px', border: '1px solid var(--color-border)' }}>
                    📄 {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="portal-funcionarios__timeline-box">
              <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px' }}>Trazabilidad del Trámite</h4>
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
                      <Check size={16} /> Aprobar Trámite
                    </button>
                    <button type="button" onClick={() => setShowRejectForm(true)} className="btn btn--danger-outline" style={{ flex: 1 }}>
                      <X size={16} /> Rechazar Trámite
                    </button>
                  </div>
                ) : (
                  <div className="reject-panel animate-fadeIn">
                    <label className="label" style={{ color: 'var(--color-danger-text)', fontWeight: 600 }}>
                      Indique el motivo del rechazo (Obligatorio para el ciudadano)
                    </label>
                    <textarea
                      value={observacion}
                      onChange={e => {
                        setObservacion(e.target.value);
                        setError('');
                      }}
                      placeholder="Ej: Padrón vehicular borroso, se solicita re-adjuntar..."
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
                        Confirmar Rechazo
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
            Seleccione una solicitud de la bandeja para comenzar la auditoría fronteriza.
          </div>
        )}
      </div>
    </div>
  );
}
