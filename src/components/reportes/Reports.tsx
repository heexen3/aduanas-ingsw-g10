import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { BarChart2, Download, FileText, TrendingUp, Calendar, Clock, Map } from 'lucide-react';

export function Reports() {
  // Datos simulados de alta fidelidad
  const dataFlujoSemanal = [
    { dia: 'Lun', vehiculos: 340, personas: 890 },
    { dia: 'Mar', vehiculos: 410, personas: 1100 },
    { dia: 'Mié', vehiculos: 380, personas: 980 },
    { dia: 'Jue', vehiculos: 460, personas: 1250 },
    { dia: 'Vie', vehiculos: 620, personas: 1800 },
    { dia: 'Sáb', vehiculos: 780, personas: 2400 },
    { dia: 'Dom', vehiculos: 690, personas: 2100 },
  ];

  const dataTendenciaMensual = [
    { mes: 'Ene', cruces: 12000 },
    { mes: 'Feb', cruces: 14500 },
    { mes: 'Mar', cruces: 9800 },
    { mes: 'Abr', cruces: 11000 },
    { mes: 'May', cruces: 13200 },
    { mes: 'Jun', cruces: 15800 },
  ];

  const pasosFronterizosStats = [
    { paso: 'Los Libertadores (Mendoza)', flujo: '42.3%', tiempo: '7.8 min', estado: 'Operativo' },
    { paso: 'Chacalluta (Arica)', flujo: '28.1%', tiempo: '5.2 min', estado: 'Operativo' },
    { paso: 'Cardenal Samoré (Osorno)', flujo: '14.5%', tiempo: '9.1 min', estado: 'Demoras leves' },
    { paso: 'Pino Hachado (Lonquimay)', flujo: '9.2%', tiempo: '6.4 min', estado: 'Operativo' },
    { paso: 'Colchane (Colchane)', flujo: '5.9%', tiempo: '12.3 min', estado: 'Congestionado' },
  ];

  const handleExport = (type: 'pdf' | 'excel') => {
    alert(`Generando y exportando reporte consolidado de estadísticas en formato ${type.toUpperCase()}...`);
  };

  return (
    <div className="reportes">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Módulo de Reportes Estadísticos
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Consolidado operativo de flujos fronterizos terrestres en pasos de Chile.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleExport('pdf')} className="btn btn--danger-outline" style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
            <FileText size={14} /> PDF
          </button>
          <button onClick={() => handleExport('excel')} className="btn btn--outline" style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}>
            <Download size={14} /> Excel
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="dashboard__grid-kpis">
        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">45.890</span>
            <span className="kpi-card__label">Cruces Totales (Mes)</span>
            <span style={{ fontSize: '10px', color: 'var(--color-success-text)', fontWeight: 600 }}>+12.4% vs mes anterior</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
            <Clock size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">7.2 min</span>
            <span className="kpi-card__label">Tiempo Medio Trámite</span>
            <span style={{ fontSize: '10px', color: 'var(--color-success-text)', fontWeight: 600 }}>-1.5 min reducción</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning-text)' }}>
            <Calendar size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">2.410</span>
            <span className="kpi-card__label">Promedio Diario Cruces</span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Pico: Sábados (4.890)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icon-wrap" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}>
            <Map size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__value">9 Pasos</span>
            <span className="kpi-card__label">Monitoreados Hoy</span>
            <span style={{ fontSize: '10px', color: 'var(--color-success-text)', fontWeight: 600 }}>100% de cobertura digital</span>
          </div>
        </div>
      </div>

      {/* Gráficos de Reportes */}
      <div className="reportes__grid-charts">
        <div className="chart-card">
          <h3 className="chart-card__title">Flujo de Tránsito Semanal (Personas y Vehículos)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={dataFlujoSemanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.05)" />
                <XAxis dataKey="dia" stroke="var(--color-text-secondary)" fontSize={11} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} />
                <Tooltip />
                <Legend fontSize={10} />
                <Bar dataKey="personas" name="Personas" fill="var(--color-primary-light)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vehiculos" name="Vehículos" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card__title">Tendencia de Cruces Semestre Actual</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={dataTendenciaMensual}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.05)" />
                <XAxis dataKey="mes" stroke="var(--color-text-secondary)" fontSize={11} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cruces" name="Tránsito total" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla Desglose por Paso */}
      <div className="chart-card">
        <h3 className="chart-card__title">Desglose Operativo por Complejo Fronterizo</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paso Fronterizo / Complejo</th>
                <th>Carga de Flujo Relativa</th>
                <th>Tiempo Promedio de Control</th>
                <th>Estado del Complejo</th>
              </tr>
            </thead>
            <tbody>
              {pasosFronterizosStats.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.paso}</strong></td>
                  <td>{item.flujo}</td>
                  <td>{item.tiempo}</td>
                  <td>
                    <span className={`badge ${
                      item.estado === 'Operativo' ? 'badge--success' :
                      item.estado === 'Demoras leves' ? 'badge--warning' : 'badge--danger'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
