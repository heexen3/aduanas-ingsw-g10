import { useState } from "react";
import { Search, CheckCircle2, Clock, AlertTriangle, XCircle, FileText, User, Car, Baby, Leaf } from "lucide-react";

const TRAMITES = [
  {
    id: "ADN-2024-1547", tipo: "Viaje", nombre: "María González", fecha: "10 Jun 2024", estado: "Aprobado", paso: "Los Libertadores",
    historial: [
      { evento: "Solicitud registrada", fecha: "10 Jun 2024 · 08:14", actor: "Sistema" },
      { evento: "Documentación validada automáticamente", fecha: "10 Jun 2024 · 08:15", actor: "Sistema PDI" },
      { evento: "Declaración SAG completada", fecha: "10 Jun 2024 · 08:22", actor: "María González" },
      { evento: "Trámite aprobado", fecha: "10 Jun 2024 · 08:31", actor: "Func. Felipe Ortega" },
    ],
    documentos: ["Cédula de identidad ✓", "Declaración SAG ✓", "Formulario de viaje ✓"],
  },
  {
    id: "ADN-2024-1548", tipo: "Vehículo", nombre: "Juan Rodríguez", fecha: "12 Jun 2024", estado: "En revisión", paso: "Chacalluta",
    historial: [
      { evento: "Solicitud registrada", fecha: "12 Jun 2024 · 09:45", actor: "Sistema" },
      { evento: "Datos del vehículo validados", fecha: "12 Jun 2024 · 09:46", actor: "Sistema" },
      { evento: "Revisión física asignada a funcionario", fecha: "12 Jun 2024 · 10:02", actor: "Sistema" },
    ],
    documentos: ["Cédula de identidad ✓", "Formulario vehicular ✓", "Revisión física (pendiente)"],
  },
  {
    id: "ADN-2024-1543", tipo: "Menor", nombre: "Pedro Silva", fecha: "13 Jun 2024", estado: "Pendiente", paso: "Cardenal Samoré",
    historial: [
      { evento: "Solicitud registrada", fecha: "13 Jun 2024 · 14:30", actor: "Pedro Silva" },
      { evento: "Autorización notarial pendiente de carga", fecha: "13 Jun 2024 · 14:30", actor: "Sistema" },
    ],
    documentos: ["Cédula de identidad ✓", "Autorización notarial (pendiente)"],
  },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  "Aprobado": { color: "#15803d", bg: "#dcfce7", icon: CheckCircle2, label: "Aprobado" },
  "En revisión": { color: "#1d4ed8", bg: "#dbeafe", icon: Clock, label: "En revisión" },
  "Pendiente": { color: "#92400e", bg: "#fef3c7", icon: AlertTriangle, label: "Pendiente" },
  "Rechazado": { color: "#b91c1c", bg: "#fee2e2", icon: XCircle, label: "Rechazado" },
};

const TIPO_ICONS: Record<string, any> = {
  "Viaje": User, "Vehículo": Car, "Menor": Baby, "SAG": Leaf,
};

export function TramiteTracking() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof TRAMITES[0] | null>(null);

  const results = TRAMITES.filter(t =>
    t.id.toLowerCase().includes(query.toLowerCase()) ||
    t.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Seguimiento de Trámites
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Consulte el estado en tiempo real de sus solicitudes</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por N° de trámite o nombre (ej: ADN-2024-1547)"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* List */}
          <div className="space-y-3">
            {results.map(t => {
              const sc = STATUS_CONFIG[t.estado];
              const Icon = sc.icon;
              const TipoIcon = TIPO_ICONS[t.tipo] || FileText;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: selected?.id === t.id ? "#1b5fad" : "rgba(11,58,110,0.08)",
                    backgroundColor: selected?.id === t.id ? "#f0f5ff" : "white",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e8eef6" }}>
                        <TipoIcon className="w-4 h-4" style={{ color: "#0b3a6e" }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{t.nombre}</div>
                        <div className="text-xs text-gray-400 font-mono">{t.id}</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
                      <Icon className="w-3 h-3" />{sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{t.tipo}</span>
                    <span>·</span>
                    <span>{t.paso}</span>
                    <span>·</span>
                    <span>{t.fecha}</span>
                  </div>
                </button>
              );
            })}
            {results.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No se encontraron trámites</p>
              </div>
            )}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="bg-white rounded-xl border p-5 space-y-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{selected.nombre}</h3>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{selected.id}</p>
                </div>
                <div>
                  {(() => {
                    const sc = STATUS_CONFIG[selected.estado];
                    const Icon = sc.icon;
                    return (
                      <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        <Icon className="w-3.5 h-3.5" />{sc.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Paso fronterizo", selected.paso],
                  ["Fecha", selected.fecha],
                  ["Tipo", selected.tipo],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                    <div className="text-sm font-medium text-gray-900">{v}</div>
                  </div>
                ))}
              </div>

              {/* Documentos */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Documentación</h4>
                <div className="space-y-1.5">
                  {selected.documentos.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full ${d.includes("pendiente") ? "bg-orange-400" : "bg-green-500"}`} />
                      <span className={d.includes("pendiente") ? "text-orange-700" : "text-gray-700"}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Historial de validaciones</h4>
                <div className="space-y-3">
                  {selected.historial.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#0b3a6e", backgroundColor: i === 0 ? "#0b3a6e" : "white" }} />
                        {i < selected.historial.length - 1 && <div className="w-px h-6 mt-1" style={{ backgroundColor: "rgba(11,58,110,0.15)" }} />}
                      </div>
                      <div className="pb-3">
                        <div className="text-xs font-medium text-gray-900">{h.evento}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{h.fecha} · {h.actor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border flex items-center justify-center py-20 text-center" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div>
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">Seleccione un trámite para ver el detalle</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
