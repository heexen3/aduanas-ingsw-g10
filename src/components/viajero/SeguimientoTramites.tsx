import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Calendar, MapPin, ClipboardList, Clock, CheckCircle, AlertTriangle, FileText, User, Car
} from 'lucide-react';
import { ESTADO_CONFIG } from '../../types';

export function SeguimientoTramites() {
  const { tramites } = useTramites();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filtrar trámites según el viajero conectado.
  // Si es un funcionario o administrador, se muestran todos (aunque para ellos crearemos portales específicos, a veces ingresan aquí también).
  const misTramites = user?.role === 'viajero'
    ? tramites.filter(t => t.viajero.rut === user.rut)
    : tramites;

  // Filtrar por término de búsqueda
  const filteredTramites = misTramites.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.viajero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.pasoFronterizo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Seleccionar el primer trámite por defecto
  const activeTramite = selectedId
    ? filteredTramites.find(t => t.id === selectedId)
    : filteredTramites[0];

  return (
    <div className="seguimiento">
      {/* Columna Izquierda: Buscador e Historial de Trámites */}
      <div className="seguimiento__list-card">
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>
          Mis Trámites Registrados
        </h3>

        {/* Input de Búsqueda */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID o Paso..."
            className="input"
            style={{ paddingLeft: '32px' }}
          />
        </div>

        {/* Lista de Trámites */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '460px', overflowY: 'auto', paddingRight: '2px' }}>
          {filteredTramites.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              No se encontraron trámites registrados.
            </div>
          ) : (
            filteredTramites.map(t => {
              const active = activeTramite?.id === t.id;
              const conf = ESTADO_CONFIG[t.estado];
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`tramite-item ${active ? 'tramite-item--active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>{t.id}</span>
                    <span className={`badge ${conf.colorClass}`}>{conf.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    <Calendar size={12} /> {t.fechaViaje}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    <MapPin size={12} /> {t.pasoFronterizo}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Columna Derecha: Detalle del Trámite Seleccionado */}
      <div className="seguimiento__detail-card">
        {activeTramite ? (
          <>
            {/* Cabecera del Detalle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Detalle del Trámite Terrestre
                </span>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
                  {activeTramite.id}
                </h2>
              </div>
              <span className={`badge ${ESTADO_CONFIG[activeTramite.estado].colorClass}`} style={{ fontSize: 'var(--text-sm)', padding: '4px 12px' }}>
                {ESTADO_CONFIG[activeTramite.estado].label}
              </span>
            </div>

            {/* Alerta de Observaciones de Rechazo */}
            {activeTramite.estado === 'rechazado' && activeTramite.observaciones && (
              <div className="alert alert--danger animate-fadeIn">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Trámite Rechazado:</strong>
                  <p style={{ marginTop: '2px', fontStyle: 'italic' }}>"{activeTramite.observaciones}"</p>
                  <p style={{ fontSize: '10px', marginTop: '6px', color: 'var(--color-danger-text)' }}>
                    Por favor, acerque su documentación física al punto de atención fronterizo o re-intente adjuntando los documentos correctos.
                  </p>
                </div>
              </div>
            )}

            {/* Información General */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Viajero Responsable</h4>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{activeTramite.viajero.nombre}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>RUN: {activeTramite.viajero.rut}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Paso y Ruta</h4>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{activeTramite.pasoFronterizo}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Destino: {activeTramite.destino}</p>
              </div>
            </div>

            {/* Documentos Adjuntos */}
            <div>
              <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} /> Carpeta de Documentos Digitales
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px' }}>
                {activeTramite.documentos.map((d, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Grupo Familiar y Menores */}
            {(activeTramite.acompanantes.length > 0 || activeTramite.menores.length > 0) && (
              <div>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> Grupo Familiar Acompañante
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeTramite.acompanantes.map((a, i) => (
                    <div key={i} style={{ padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{a.nombre} ({a.rut})</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{a.parentesco}</span>
                    </div>
                  ))}
                  {activeTramite.menores.map((m, i) => (
                    <div key={i} style={{ padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', background: 'var(--color-primary-bg)' }}>
                      <span>👶 {m.nombre} ({m.rut}) - {m.edad} años</span>
                      <span style={{ color: 'var(--color-success-text)', fontWeight: 500 }}>
                        {m.docAdjunto ? '✓ Autorizado' : '❌ Sin autorización'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehículo Particular */}
            {activeTramite.vehiculo && (
              <div style={{ padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.35)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Car size={12} /> Vehículo Registrado
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-2)', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Patente</span>
                    <p style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{activeTramite.vehiculo.patente}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Marca / Modelo</span>
                    <p style={{ fontWeight: 500 }}>{activeTramite.vehiculo.marca} {activeTramite.vehiculo.modelo}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Propietario</span>
                    <p style={{ fontWeight: 500 }}>{activeTramite.vehiculo.propietario}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Declaración SAG */}
            {activeTramite.declaracionSAG && (
              <div style={{ padding: 'var(--space-4)', background: activeTramite.declaracionSAG.traeProductos ? 'var(--color-warning-bg)' : 'var(--color-success-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                  Estado Declaración Fitosanitaria (SAG)
                </h4>
                {activeTramite.declaracionSAG.traeProductos ? (
                  <div>
                    <span style={{ color: 'var(--color-warning-text)', fontWeight: 600, fontSize: '11px' }}>
                      ⚠️ Contiene productos regulados declarados:
                    </span>
                    <p style={{ fontSize: '11px', marginTop: '2px', background: 'rgba(0, 0, 0, 0.2)', padding: '6px', borderRadius: '4px', color: 'var(--color-text-primary)' }}>
                      {activeTramite.declaracionSAG.descripcion}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: '11px', color: 'var(--color-success-text)', fontWeight: 500 }}>
                    ✓ Sin productos de origen animal/vegetal regulados declarados. Pre-aprobación exitosa.
                  </p>
                )}
              </div>
            )}

            {/* Timeline del Trámite */}
            <div>
              <h4 style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                Línea de Tiempo del Trámite (Trazabilidad)
              </h4>
              <div className="timeline">
                {activeTramite.historial.map((h, i) => (
                  <div key={i} className="timeline__item">
                    <div className={`timeline__dot ${i === activeTramite.historial.length - 1 ? 'timeline__dot--active' : ''}`} />
                    <div className="timeline__info">
                      <span className="timeline__event">{h.evento}</span>
                      <span className="timeline__meta">Registrado por {h.actor} · {h.fecha}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Seleccione un trámite de la lista para visualizar su historial y detalles completos.
          </div>
        )}
      </div>
    </div>
  );
}
