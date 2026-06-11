import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart2, Download, FileSpreadsheet, TrendingUp, Users, Car, Clock } from "lucide-react";

const weekData = [
  { dia: "Lun", personas: 3420, vehiculos: 1102 },
  { dia: "Mar", personas: 3890, vehiculos: 1245 },
  { dia: "Mié", personas: 3210, vehiculos: 980 },
  { dia: "Jue", personas: 4100, vehiculos: 1380 },
  { dia: "Vie", personas: 5230, vehiculos: 1870 },
  { dia: "Sáb", personas: 6780, vehiculos: 2310 },
  { dia: "Dom", personas: 5190, vehiculos: 1760 },
];

const monthData = [
  { mes: "Ene", ingr: 89400, sal: 87200 },
  { mes: "Feb", ingr: 78300, sal: 76100 },
  { mes: "Mar", ingr: 92100, sal: 90400 },
  { mes: "Abr", ingr: 103500, sal: 101200 },
  { mes: "May", ingr: 115800, sal: 112300 },
  { mes: "Jun", ingr: 67400, sal: 65100 },
];

const PASOS_DATA = [
  { paso: "Los Libertadores", personas: 42580, vehiculos: 14320, aprobacion: 97.2 },
  { paso: "Chacalluta", personas: 28430, vehiculos: 9870, aprobacion: 95.8 },
  { paso: "Cardenal Samoré", personas: 18920, vehiculos: 6430, aprobacion: 98.1 },
  { paso: "Pino Hachado", personas: 12340, vehiculos: 4120, aprobacion: 96.4 },
  { paso: "Colchane", personas: 9870, vehiculos: 2890, aprobacion: 94.2 },
  { paso: "Jama", personas: 7620, vehiculos: 2340, aprobacion: 97.8 },
];

export function Reports() {
  return (
    <div className="p-5 lg:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Reportes y Estadísticas
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Panel de indicadores operacionales</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50" style={{ borderColor: "rgba(11,58,110,0.15)", color: "#0b3a6e" }}>
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "#0b3a6e" }}>
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Personas este mes", value: "546.820", delta: "+8.3%", icon: Users, color: "#0b3a6e", bg: "#e8eef6" },
          { label: "Vehículos este mes", value: "187.420", delta: "+5.1%", icon: Car, color: "#1b5fad", bg: "#dbeafe" },
          { label: "Tiempo promedio", value: "7.3 min", delta: "−18%", icon: Clock, color: "#27ae60", bg: "#dcfce7" },
          { label: "Tasa de aprobación", value: "96.4%", delta: "+1.2pp", icon: TrendingUp, color: "#e67e22", bg: "#fef3c7" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border p-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.bg }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: k.color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "#27ae60" }}>{k.delta}</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">{k.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Weekly bar */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Flujo semanal</h3>
              <p className="text-xs text-gray-400 mt-0.5">Personas y vehículos por día</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.06)" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="personas" fill="#0b3a6e" name="Personas" radius={[3, 3, 0, 0]} />
              <Bar dataKey="vehiculos" fill="#2b7dc8" name="Vehículos" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly line */}
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Ingresos y salidas mensuales 2024</h3>
            <p className="text-xs text-gray-400 mt-0.5">Personas procesadas</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,58,110,0.06)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="ingr" stroke="#0b3a6e" strokeWidth={2} dot={false} name="Ingresos" />
              <Line type="monotone" dataKey="sal" stroke="#2b7dc8" strokeWidth={2} dot={false} name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <h3 className="text-sm font-semibold text-gray-900">Estadísticas por paso fronterizo — acumulado 2024</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f8fafd" }}>
                {["Paso fronterizo", "Personas ingresadas", "Vehículos registrados", "Tasa de aprobación", "Estado"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PASOS_DATA.map((row, i) => (
                <tr key={row.paso} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.paso}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.personas.toLocaleString("es-CL")}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.vehiculos.toLocaleString("es-CL")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.aprobacion}%`, backgroundColor: row.aprobacion >= 97 ? "#27ae60" : row.aprobacion >= 95 ? "#1b5fad" : "#e67e22" }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{row.aprobacion}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>Operativo</span>
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
