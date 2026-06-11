import { useState } from "react";
import { Car, FileText, CheckCircle2, Printer, Info } from "lucide-react";

const MARCAS = ["Toyota", "Chevrolet", "Hyundai", "Kia", "Nissan", "Honda", "Ford", "Volkswagen", "Mitsubishi", "Suzuki", "Mazda", "Subaru", "Otro"];

export function VehicleRegistration() {
  const [tipo, setTipo] = useState<"salida" | "ingreso">("salida");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ patente: "", marca: "", modelo: "", anio: "", propietario: "", rut: "", color: "" });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (submitted) {
    return (
      <div className="p-7 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border p-8" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#dcfce7" }}>
              <CheckCircle2 className="w-6 h-6" style={{ color: "#15803d" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Formulario generado exitosamente</h2>
              <p className="text-sm text-gray-500">Formulario de {tipo === "salida" ? "Salida Temporal" : "Ingreso Temporal"} · Vehículo</p>
            </div>
          </div>

          {/* Generated form preview */}
          <div className="bg-gray-50 rounded-xl border p-6 mb-6" style={{ borderColor: "rgba(11,58,110,0.1)" }}>
            <div className="text-center mb-5 pb-5 border-b" style={{ borderColor: "rgba(11,58,110,0.1)" }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">SERVICIO NACIONAL DE ADUANAS · CHILE</div>
                  <div className="text-sm font-bold text-gray-900">FORMULARIO {tipo === "salida" ? "SALIDA" : "INGRESO"} TEMPORAL DE VEHÍCULO</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">N° VST-2024-{Math.floor(Math.random() * 9000 + 1000)} · {new Date().toLocaleDateString("es-CL")}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Patente", form.patente || "ABCD·12"],
                ["Marca", form.marca || "Toyota"],
                ["Modelo", form.modelo || "Hilux"],
                ["Año", form.anio || "2021"],
                ["Color", form.color || "Blanco"],
                ["Propietario", form.propietario || "Juan Rodríguez Soto"],
                ["RUT", form.rut || "12.345.678-9"],
                ["Tipo de operación", tipo === "salida" ? "Salida temporal" : "Ingreso temporal"],
                ["Fecha de emisión", new Date().toLocaleDateString("es-CL")],
                ["Fecha de vencimiento", new Date(Date.now() + 90 * 864e5).toLocaleDateString("es-CL")],
              ].map(([k, v]) => (
                <div key={k} className="border-b pb-2" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-medium text-gray-900">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t text-center" style={{ borderColor: "rgba(11,58,110,0.1)" }}>
              <div className="text-xs text-gray-500">Código QR de verificación</div>
              <div className="mt-2 w-16 h-16 mx-auto border-2 rounded p-1" style={{ borderColor: "#0b3a6e" }}>
                <div className="w-full h-full grid grid-cols-4 gap-px">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="rounded-sm" style={{ backgroundColor: Math.random() > 0.5 ? "#0b3a6e" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-blue-50"
              style={{ borderColor: "#0b3a6e", color: "#0b3a6e" }}
            >
              <Printer className="w-4 h-4" /> Imprimir formulario
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 py-2.5 rounded-lg text-sm text-white font-medium"
              style={{ backgroundColor: "#0b3a6e" }}
            >
              Nuevo registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Car className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Registro de Vehículos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Generación de formulario de salida o ingreso temporal de vehículos</p>
        </div>

        {/* Type selector */}
        <div className="flex gap-4 mb-6">
          {["salida", "ingreso"].map(t => (
            <button
              key={t}
              onClick={() => setTipo(t as any)}
              className="flex-1 py-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
              style={{
                borderColor: tipo === t ? "#0b3a6e" : "rgba(11,58,110,0.12)",
                backgroundColor: tipo === t ? "#e8eef6" : "white",
                color: tipo === t ? "#0b3a6e" : "#6b7280",
              }}
            >
              <Car className="w-4 h-4" />
              {t === "salida" ? "Salida temporal de Chile" : "Ingreso temporal a Chile"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: "#0b3a6e" }} />
            <h2 className="text-sm font-semibold text-gray-900">Datos del vehículo</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Patente</label>
              <input
                type="text"
                value={form.patente}
                onChange={e => update("patente", e.target.value.toUpperCase())}
                placeholder="ABCD·12 o AB·1234"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Marca</label>
              <select value={form.marca} onChange={e => update("marca", e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50">
                <option value="">Seleccione</option>
                {MARCAS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Modelo</label>
              <input type="text" value={form.modelo} onChange={e => update("modelo", e.target.value)} placeholder="Ej: Hilux, Spark, Accent"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Año</label>
              <input type="number" value={form.anio} onChange={e => update("anio", e.target.value)} placeholder="2021" min="1980" max="2025"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Color</label>
              <input type="text" value={form.color} onChange={e => update("color", e.target.value)} placeholder="Blanco, Gris, Negro..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Tipo de vehículo</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50">
                <option>Automóvil</option>
                <option>Camioneta / SUV</option>
                <option>Motocicleta</option>
                <option>Furgón</option>
                <option>Camión</option>
                <option>Casa rodante</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
            <h3 className="text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wide">Datos del propietario</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre completo</label>
                <input type="text" value={form.propietario} onChange={e => update("propietario", e.target.value)} placeholder="Nombre del propietario"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">RUT</label>
                <input type="text" value={form.rut} onChange={e => update("rut", e.target.value)} placeholder="12.345.678-9"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50 font-mono" />
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4 flex items-start gap-3" style={{ borderColor: "rgba(11,58,110,0.08)", backgroundColor: "#f8fafd" }}>
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1b5fad" }} />
            <p className="text-xs text-gray-600">
              El formulario de <strong>{tipo === "salida" ? "salida temporal" : "ingreso temporal"}</strong> tiene una vigencia de 90 días.
              Debe presentarlo al retorno del vehículo. Conserve una copia digital y física.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
            <button
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm text-white font-medium"
              style={{ backgroundColor: "#0b3a6e" }}
            >
              <FileText className="w-4 h-4" /> Generar formulario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
