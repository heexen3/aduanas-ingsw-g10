import { useState } from "react";
import { Leaf, CheckCircle2, AlertTriangle, Package, Wheat, Beef } from "lucide-react";

const ALIMENTOS = [
  { id: "frutas", label: "Frutas frescas o secas", riesgo: "Alto" },
  { id: "verduras", label: "Verduras y hortalizas", riesgo: "Alto" },
  { id: "lacteos", label: "Lácteos y derivados", riesgo: "Medio" },
  { id: "embutidos", label: "Fiambres y embutidos", riesgo: "Alto" },
  { id: "conservas", label: "Conservas y alimentos envasados", riesgo: "Bajo" },
  { id: "semillas", label: "Semillas y cereales", riesgo: "Medio" },
];

const VEGETALES = [
  { id: "plantas", label: "Plantas vivas o con raíz" },
  { id: "flores", label: "Flores cortadas" },
  { id: "madera", label: "Madera o productos de madera sin tratar" },
  { id: "suelo", label: "Tierra, arena o sustrato" },
];

const ANIMALES = [
  { id: "mascotas", label: "Mascotas (perros, gatos, aves)" },
  { id: "animales_granja", label: "Animales de granja o producción" },
  { id: "peces", label: "Peces u organismos acuáticos" },
  { id: "miel", label: "Miel o productos apícolas" },
  { id: "cueros", label: "Cueros, pieles o trofeos" },
];

const RIESGO_COLORS: Record<string, { bg: string; text: string }> = {
  "Alto": { bg: "#fee2e2", text: "#b91c1c" },
  "Medio": { bg: "#fef3c7", text: "#92400e" },
  "Bajo": { bg: "#dcfce7", text: "#15803d" },
};

export function SAGDeclaration() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState<"alimentos" | "vegetales" | "animales">("alimentos");

  const toggle = (key: string) => setSelected(p => ({ ...p, [key]: !p[key] }));

  const hasDeclaration = Object.values(selected).some(Boolean);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  if (submitted) {
    return (
      <div className="p-7 max-w-xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-10 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: hasDeclaration ? "#fef3c7" : "#dcfce7" }}>
            {hasDeclaration ? <AlertTriangle className="w-8 h-8" style={{ color: "#e67e22" }} /> : <CheckCircle2 className="w-8 h-8" style={{ color: "#15803d" }} />}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Declaración enviada</h2>
          <p className="text-gray-500 text-sm mb-2">
            {hasDeclaration
              ? "Declaró productos SAG. Su equipaje podrá ser revisado por un funcionario SAG."
              : "No declaró productos SAG. Proceed con el paso habitual."}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2 mt-4">
            <div className="flex justify-between text-sm"><span className="text-gray-500">N° de declaración</span><span className="font-mono font-semibold text-gray-900">SAG-2024-0847</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Ítem declarados</span><span className="text-gray-900">{selectedCount} producto(s)</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Estado</span><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
              {hasDeclaration ? "Revisión pendiente" : "Aprobado automáticamente"}
            </span></div>
          </div>
          <button onClick={() => { setSubmitted(false); setSelected({}); }} className="px-6 py-2.5 rounded-lg text-sm text-white font-medium" style={{ backgroundColor: "#0b3a6e" }}>
            Nueva declaración
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Leaf className="w-5 h-5" style={{ color: "#27ae60" }} /> Declaración SAG
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Servicio Agrícola y Ganadero · Declaración obligatoria de ingreso a Chile</p>
        </div>

        {/* Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-800">
            <strong>Es obligatorio declarar</strong> todos los productos agropecuarios, alimentos frescos, plantas y animales que ingrese a Chile.
            No declarar es una infracción sancionada con multa de hasta $1.000.000 CLP.
          </p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { id: "alimentos", label: "Alimentos", icon: Package },
            { id: "vegetales", label: "Productos vegetales", icon: Wheat },
            { id: "animales", label: "Productos animales", icon: Beef },
          ].map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id as any)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeSection === s.id ? "#0b3a6e" : "transparent",
                  color: activeSection === s.id ? "#fff" : "#6b7280",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          {activeSection === "alimentos" && (
            <>
              <h2 className="text-sm font-semibold text-gray-900">¿Transporta alguno de los siguientes alimentos?</h2>
              <div className="space-y-2">
                {ALIMENTOS.map(item => {
                  const rc = RIESGO_COLORS[item.riesgo];
                  return (
                    <label
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: selected[item.id] ? "#1b5fad" : "rgba(11,58,110,0.08)", backgroundColor: selected[item.id] ? "#f0f5ff" : "transparent" }}
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={!!selected[item.id]} onChange={() => toggle(item.id)} className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-800">{item.label}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={rc}>Riesgo {item.riesgo}</span>
                    </label>
                  );
                })}
              </div>
            </>
          )}

          {activeSection === "vegetales" && (
            <>
              <h2 className="text-sm font-semibold text-gray-900">¿Transporta alguno de los siguientes productos vegetales?</h2>
              <div className="space-y-2">
                {VEGETALES.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: selected[item.id] ? "#1b5fad" : "rgba(11,58,110,0.08)", backgroundColor: selected[item.id] ? "#f0f5ff" : "transparent" }}
                  >
                    <input type="checkbox" checked={!!selected[item.id]} onChange={() => toggle(item.id)} className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {activeSection === "animales" && (
            <>
              <h2 className="text-sm font-semibold text-gray-900">¿Transporta alguno de los siguientes productos o animales?</h2>
              <div className="space-y-2">
                {ANIMALES.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: selected[item.id] ? "#1b5fad" : "rgba(11,58,110,0.08)", backgroundColor: selected[item.id] ? "#f0f5ff" : "transparent" }}
                  >
                    <input type="checkbox" checked={!!selected[item.id]} onChange={() => toggle(item.id)} className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Declaration summary */}
          {selectedCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-xs text-orange-800">
                <strong>{selectedCount} ítem(s) declarado(s).</strong> Su equipaje podrá ser inspeccionado por un funcionario SAG al cruzar el paso fronterizo.
                Tenga los productos accesibles para revisión.
              </p>
            </div>
          )}

          {/* Confirmation checkbox */}
          <div className="border-t pt-4" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded" />
              <span className="text-xs text-gray-600">
                Declaro bajo juramento que la información proporcionada es verídica y completa. Entiendo que la declaración falsa constituye una infracción sancionable.
              </span>
            </label>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="w-full py-3 rounded-xl text-sm text-white font-medium mt-2"
            style={{ backgroundColor: "#0b3a6e" }}
          >
            Confirmar declaración SAG
          </button>
        </div>
      </div>
    </div>
  );
}
