import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plane, Car, Leaf, Clock, AlertTriangle, Shield, CheckCircle, Info
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { ESTADO_CONFIG, ROLE_LABELS } from '../../types';

export function Dashboard() {
  const { tramites } = useTramites();
  const { user } = useAuth();

  // KPIs dinámicos
  const totalTramites = tramites.length;
  const pendientes = tramites.filter(t => t.estado === 'pendiente' || t.estado === 'en-revision' || t.estado === 'pendiente-inspeccion').length;
  const aprobados = tramites.filter(t => t.estado === 'aprobado').length;
  const rechazados = tramites.filter(t => t.estado === 'rechazado').length;

  // 1. Datos para gráfico de flujo por hora (simulado pero con un estilo excelente)
  const dataFlujoHora = [
    { hora: '08:00', vehiculos: 120, personas: 340 },
    { hora: '10:00', vehiculos: 240, personas: 580 },
    { hora: '12:00', vehiculos: 310, personas: 890 },
    { hora: '14:00', vehiculos: 190, personas: 620 },
    { hora: '16:00', vehiculos: 280, personas: 790 },
    { hora: '18:00', vehiculos: 150, personas: 410 },
  ];

  // 2. Distribución de estados (dinámico)
  const dataEstados = [
    { name: 'Aprobados', value: aprobados || 1, color: 'var(--color-success)' },
    { name: 'Pendientes', value: pendientes || 1, color: 'var(--color-warning)' },
    { name: 'Rechazados', value: rechazados || 1, color: 'var(--color-danger)' },
  ];

  // 3. Distribución por pasos fronterizos (dinámico)
  const pasosStats = tramites.reduce((acc: Record<string, number>, t) => {
    const name = t.pasoFronterizo.split(' ')[0]; // Tomar el nombre principal
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const dataPasos = Object.keys(pasosStats).map(key => ({
    paso: key,
    cantidad: pasosStats[key],
  })).slice(0, 5);

  // Datos fallback si no hay suficientes trámites
  const chartDataPasos = dataPasos.length > 0 ? dataPasos : [
    { paso: 'Libertadores', cantidad: 12 },
    { paso: 'Chacalluta', cantidad: 8 },
    { paso: 'Samoré', cantidad: 5 },
    { paso: 'Pino Hachado', cantidad: 4 },
  ];

  // Últimos 4 trámites registrados
  const ultimosTramites = tramites.slice(0, 4);

  return (
    <div className="dashboard">
      <div className="dashboard__title-row">
        <div>
          <h1 className="dashboard__title">Panel de Control</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Bienvenido, {user?.nombre}. Aquí tienes el resumen operativo de aduanas.
          </p>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="dashboard__grid-kpis">
        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
            <Plane size={24} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">{totalTramites}</span>
            <span className="kpi-card__label">Trámites Totales</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning-text)' }}>
            <Clock size={24} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">{pendientes}</span>
            <span className="kpi-card__label">Pendientes / Revisión</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">{aprobados}</span>
            <span className="kpi-card__label">Trámites Aprobados</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">{rechazados}</span>
            <span className="kpi-card__label">Trámites Rechazados</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dashboard__grid-charts">
        {/* Gráfico flujo horario */}
        <div className="chart-card chart-card--span-2">
          <h3 className="chart-card__title">Flujo Estimado por Horario (Frontera)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={dataFlujoHora} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVehiculos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-light)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary-light)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPersonas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.05)" />
                <XAxis dataKey="hora" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--color-border-strong)', borderRadius: '8px', color: 'var(--color-text-primary)' }} />
                <Area type="monotone" dataKey="personas" name="Personas" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorPersonas)" strokeWidth={2} />
                <Area type="monotone" dataKey="vehiculos" name="Vehículos" stroke="var(--color-primary-light)" fillOpacity={1} fill="url(#colorVehiculos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico distribución de estados */}
        <div className="chart-card">
          <h3 className="chart-card__title">Distribución de Trámites</h3>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dataEstados}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataEstados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', paddingRight: '12px' }}>
              {dataEstados.map(e => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: e.color }} />
                  <span style={{ fontWeight: 500 }}>{e.name}: {e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Recientes + Alertas */}
      <div className="dashboard__bottom-grid">
        {/* Tabla de actividad reciente */}
        <div className="chart-card">
          <h3 className="chart-card__title">Trámites Recientes</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>N° Trámite</th>
                  <th>Viajero</th>
                  <th>Paso Fronterizo</th>
                  <th>Fecha Viaje</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimosTramites.map(t => {
                  const conf = ESTADO_CONFIG[t.estado];
                  return (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{t.id}</td>
                      <td>{t.viajero.nombre}</td>
                      <td>{t.pasoFronterizo}</td>
                      <td>{t.fechaViaje}</td>
                      <td>
                        <span className={`badge ${conf.colorClass}`}>
                          {conf.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertas */}
        <div className="chart-card">
          <h3 className="chart-card__title">Alertas y Avisos de Frontera</h3>
          <div className="alerts-list">
            <div className="alert-item alert-item--danger">
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Control Sanitario Fitosanitario</strong>
                SAG reporta aumento de controles en Paso Los Libertadores. Recuerde declarar frutas y vegetales.
              </div>
            </div>

            <div className="alert-item alert-item--warning">
              <Clock size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Congestión por Clima</strong>
                Paso Pino Hachado opera con demoras de 40 minutos debido a nevadas intermitentes. Porte obligatorio de cadenas.
              </div>
            </div>

            <div className="alert-item alert-item--info">
              <Info size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Nueva Normativa de Menores</strong>
                Desde julio, todas las actas de autorización notarial deben estar firmadas digitalmente y ser legibles en PDF.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
