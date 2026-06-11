import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, CheckCircle2, AlertTriangle, Car, Users, Leaf, FileText, ArrowRight, Activity } from "lucide-react";

const areaData = [
  { hora: "06:00", ingresos: 42, salidas: 28 },
  { hora: "07:00", ingresos: 87, salidas: 65 },
  { hora: "08:00", ingresos: 143, salidas: 112 },
  { hora: "09:00", ingresos: 198, salidas: 167 },
  { hora: "10:00", ingresos: 231, salidas: 189 },
  { hora: "11:00", ingresos: 186, salidas: 201 },
  { hora: "12:00", ingresos: 157, salidas: 143 },
  { hora: "13:00", ingresos: 172, salidas: 158 },
  { hora: "14:00", ingresos: 203, salidas: 191 },
  { hora: "15:00", ingresos: 245, salidas: 212 },
];

const pasoData = [
  { paso: "Los Libertadores", tramites: 1247 },
  { paso: "Chacalluta", tramites: 892 },
  { paso: "Cardenal Samoré", tramites: 543 },
  { paso: "Pino Hachado", tramites: 421 },
  { paso: "Colchane", tramites: 312 },
];

const pieData = [
  { name: "Aprobados", value: 73, color: "#27ae60" },
  { name: "En revisión", value: 18, color: "#1b5fad" },
  { name: "Pendientes", value: 6, color: "#e67e22" },
  { name: "Rechazados", value: 3, color: "#c0392b" },
];

const recentActivity = [
  { id: "ADN-2024-1547", tipo: "Turista", nombre: "María González", paso: "Los Libertadores", estado: "Aprobado", hora: "15:42" },
  { id: "ADN-2024-1546", tipo: "Vehículo", nombre: "Carlos Muñoz", paso: "Chacalluta", estado: "En revisión", hora: "15:38" },
  { id: "ADN-2024-1545", tipo: "SAG", nombre: "Ana Pérez", paso: "Los Libertadores", estado: "Aprobado", hora: "15:29" },
  { id: "ADN-2024-1544", tipo: "Menor", nombre: "Pedro Silva", paso: "Cardenal Samoré", estado: "Pendiente", hora: "15:21" },
  { id: "ADN-2024-1543", tipo: "Turista", nombre: "Laura Torres", paso: "Pino Hachado", estado: "Aprobado", hora: "15:15" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Aprobado": { bg: "#dcfce7", text: "#15803d" },
  "En revisión": { bg: "#dbeafe", text: "#1d4ed8" },
  "Pendiente": { bg: "#fef3c7", text: "#92400e" },
  "Rechazado": { bg: "#fee2e2", text: "#b91c1c" },
};

export function Dashboard() {
  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Trámites hoy", value: "3.847", sub: "+12% vs ayer", icon: FileText, color: "#0b3a6e", bgColor: "#e8eef6" },
          { label: "Tiempo promedio", value: "7.3 min", sub: "−1.2 min esta semana", icon: Clock, color: "#27ae60", bgColor: "#dcfce7" },
          { label: "Aprobación SAG", value: "94.2%", sub: "1.203 revisiones", icon: Leaf, color: "#e67e22", bgColor: "#fef3c7" },
          { label: "Vehículos hoy", value: "1.124", sub: "326 salidas temporales", icon: Car, color: "#1b5fad", bgColor: "#dbeafe" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bgColor }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-0.5">{card.value}</div>
              <div className="text-xs text-gray-500">{card.label}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3" />{card.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Flujo de personas — hoy</h3>
              <p className="text-xs text-gray-400 mt-0.5">Ingresos y salidas por hora</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: "#0b3a6e" }} />Ingresos</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: "#2b7dc8" }} />Salidas</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0b3a6e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0b3a6e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2b7dc8" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2b7dc8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.06)" />
              <XAxis dataKey="hora" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(11,58,110,0.1)" }} />
              <Area type="monotone" dataKey="ingresos" stroke="#0b3a6e" strokeWidth={2} fill="url(#gIn)" />
              <Area type="monotone" dataKey="salidas" stroke="#2b7dc8" strokeWidth={2} fill="url(#gOut)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Estado de trámites</h3>
          <p className="text-xs text-gray-400 mb-4">Distribución actual</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart + Activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Trámites por paso fronterizo</h3>
          <p className="text-xs text-gray-400 mb-5">Acumulado semanal</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pasoData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis type="category" dataKey="paso" width={120} tick={{ fontSize: 10, fill: "#6b7280" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(11,58,110,0.1)" }} />
              <Bar dataKey="tramites" fill="#1b5fad" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Actividad reciente</h3>
              <p className="text-xs text-gray-400 mt-0.5">Últimos trámites procesados</p>
            </div>
            <button className="text-xs flex items-center gap-1 hover:underline" style={{ color: "#1b5fad" }}>
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map(item => {
              const sc = STATUS_COLORS[item.estado];
              return (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: sc.bg, border: `1.5px solid ${sc.text}` }} />
                    <div>
                      <div className="text-xs font-medium text-gray-900">{item.nombre}</div>
                      <div className="text-xs text-gray-400">{item.id} · {item.paso}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {item.estado}
                    </span>
                    <span className="text-xs text-gray-400">{item.hora}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { icon: AlertTriangle, color: "#e67e22", bg: "#fef3c7", title: "Alta demanda", desc: "Los Libertadores: tiempo de espera estimado 22 min" },
          { icon: CheckCircle2, color: "#27ae60", bg: "#dcfce7", title: "Sistema SAG activo", desc: "Integración con SAG operativa. 94.2% de tasa de aprobación" },
          { icon: Users, color: "#1b5fad", bg: "#dbeafe", title: "PDI en línea", desc: "Verificación de identidad automática activa en 18 pasos" },
        ].map(alert => {
          const Icon = alert.icon;
          return (
            <div key={alert.title} className="bg-white rounded-xl p-4 border flex items-start gap-3" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: alert.bg }}>
                <Icon className="w-4 h-4" style={{ color: alert.color }} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{alert.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
