import { useState } from "react";
import { Users, Search, CheckCircle2, XCircle, MessageSquare, Eye, Clock, Filter } from "lucide-react";

const SOLICITUDES = [
  { id: "ADN-2024-1542", nombre: "Roberto Fernández", rut: "9.876.543-2", tipo: "Viaje", paso: "Los Libertadores", estado: "Pendiente", hora: "14:52", prioridad: "Normal" },
  { id: "ADN-2024-1543", nombre: "Claudia Morales", rut: "15.234.876-K", tipo: "SAG", paso: "Chacalluta", estado: "En revisión", hora: "14:38", prioridad: "Urgente" },
  { id: "ADN-2024-1544", nombre: "Andrés Vega", rut: "11.456.789-3", tipo: "Vehículo", paso: "Los Libertadores", estado: "Pendiente", hora: "14:21", prioridad: "Normal" },
  { id: "ADN-2024-1545", nombre: "Sofía Castro", rut: "18.765.432-1", tipo: "Menor", paso: "Pino Hachado", estado: "Pendiente", hora: "14:10", prioridad: "Urgente" },
  { id: "ADN-2024-1540", nombre: "Luis Herrera", rut: "12.987.654-5", tipo: "Viaje", paso: "Cardenal Samoré", estado: "Aprobado", hora: "13:55", prioridad: "Normal" },
  { id: "ADN-2024-1539", nombre: "Patricia Ríos", rut: "8.123.456-7", tipo: "Viaje", paso: "Colchane", estado: "Rechazado", hora: "13:30", prioridad: "Normal" },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  "Aprobado": { color: "#15803d", bg: "#dcfce7" },
  "En revisión": { color: "#1d4ed8", bg: "#dbeafe" },
  "Pendiente": { color: "#92400e", bg: "#fef3c7" },
  "Rechazado": { color: "#b91c1c", bg: "#fee2e2" },
};

export function OfficialsPortal() {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [selected, setSelected] = useState<typeof SOLICITUDES[0] | null>(null);
  const [obs, setObs] = useState("");
  const [actioned, setActioned] = useState<Record<string, string>>({});

  const filtered = SOLICITUDES.filter(s =>
    (s.nombre.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (filterEstado === "Todos" || s.estado === filterEstado)
  );

  const handleAction = (action: "Aprobado" | "Rechazado") => {
    if (selected) {
      setActioned(p => ({ ...p, [selected.id]: action }));
      setSelected(null);
      setObs("");
    }
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Portal de Funcionarios
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Revisión y aprobación de solicitudes en tiempo real</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Pendientes", value: SOLICITUDES.filter(s => s.estado === "Pendiente").length, color: "#92400e", bg: "#fef3c7" },
            { label: "En revisión", value: SOLICITUDES.filter(s => s.estado === "En revisión").length, color: "#1d4ed8", bg: "#dbeafe" },
            { label: "Aprobados hoy", value: 127, color: "#15803d", bg: "#dcfce7" },
            { label: "Rechazados hoy", value: 8, color: "#b91c1c", bg: "#fee2e2" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border p-4 text-center" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div className="text-2xl font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-3 space-y-3">
            {/* Search + filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o N° trámite"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <select
                  value={filterEstado}
                  onChange={e => setFilterEstado(e.target.value)}
                  className="pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white"
                >
                  <option>Todos</option>
                  <option>Pendiente</option>
                  <option>En revisión</option>
                  <option>Aprobado</option>
                  <option>Rechazado</option>
                </select>
              </div>
            </div>

            {filtered.map(s => {
              const sc = STATUS_CONFIG[actioned[s.id] ?? s.estado] ?? STATUS_CONFIG["Pendiente"];
              const currentEstado = actioned[s.id] ?? s.estado;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: selected?.id === s.id ? "#1b5fad" : "rgba(11,58,110,0.08)",
                    backgroundColor: selected?.id === s.id ? "#f0f5ff" : "white",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{s.nombre}</span>
                      <span className="ml-2 text-xs text-gray-400 font-mono">{s.rut}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.prioridad === "Urgente" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}>Urgente</span>
                      )}
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{currentEstado}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="px-2 py-0.5 rounded" style={{ backgroundColor: "#e8eef6", color: "#0b3a6e" }}>{s.tipo}</span>
                    <span>{s.paso}</span>
                    <span className="ml-auto flex items-center gap-1"><Clock className="w-3 h-3" />{s.hora}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail / Action panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-xl border p-5 sticky top-4" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Revisión de solicitud</h3>
                  <span className="text-xs font-mono text-gray-400">{selected.id}</span>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    ["Solicitante", selected.nombre],
                    ["RUT", selected.rut],
                    ["Tipo", selected.tipo],
                    ["Paso fronterizo", selected.paso],
                    ["Hora de ingreso", selected.hora],
                    ["Prioridad", selected.prioridad],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs border-b pb-2 last:border-0 last:pb-0" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border mb-4 transition-colors hover:bg-blue-50" style={{ borderColor: "#1b5fad", color: "#1b5fad" }}>
                  <Eye className="w-3.5 h-3.5" /> Ver documentación completa
                </button>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Observaciones
                  </label>
                  <textarea
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                    rows={3}
                    placeholder="Escriba observaciones o el motivo de la decisión..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 bg-gray-50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAction("Rechazado")}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-red-50"
                    style={{ borderColor: "#c0392b", color: "#c0392b" }}
                  >
                    <XCircle className="w-4 h-4" /> Rechazar
                  </button>
                  <button
                    onClick={() => handleAction("Aprobado")}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: "#27ae60" }}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Aprobar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border flex items-center justify-center py-16 text-center" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-xs text-gray-400">Seleccione una solicitud<br />para revisarla</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
