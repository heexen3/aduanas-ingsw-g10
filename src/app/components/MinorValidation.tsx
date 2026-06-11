import { useState } from "react";
import { Baby, Upload, CheckCircle2, Clock, AlertTriangle, FileText, Shield } from "lucide-react";

const CASES = [
  { id: "MEN-001", nombre: "Sofía Rodríguez Pérez", edad: 8, tutor: "Juan Rodríguez", estado: "Aprobado", fecha: "10 Jun 2024" },
  { id: "MEN-002", nombre: "Matías González Silva", edad: 12, tutor: "Carmen Silva", estado: "Pendiente", fecha: "12 Jun 2024" },
  { id: "MEN-003", nombre: "Valentina Torres Muñoz", edad: 5, tutor: "Pedro Torres", estado: "En revisión", fecha: "13 Jun 2024" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  "Aprobado": { bg: "#dcfce7", text: "#15803d", icon: CheckCircle2 },
  "Pendiente": { bg: "#fef3c7", text: "#92400e", icon: Clock },
  "En revisión": { bg: "#dbeafe", text: "#1d4ed8", icon: Clock },
  "Rechazado": { bg: "#fee2e2", text: "#b91c1c", icon: AlertTriangle },
};

export function MinorValidation() {
  const [tab, setTab] = useState<"list" | "new">("list");
  const [uploadStatus, setUploadStatus] = useState<Record<string, boolean>>({});

  const handleUpload = (key: string) => {
    setTimeout(() => setUploadStatus(p => ({ ...p, [key]: true })), 800);
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Baby className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Validación de Menores de Edad
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Autorización notarial para salida del país de menores</p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Requisito legal</p>
            <p className="text-xs text-blue-700 mt-1">
              Los menores de 18 años que viajen sin ambos padres deben presentar autorización notarial firmada ante notario.
              El documento debe ser vigente (máx. 30 días) y legible. Ley N° 16.618, Art. 49.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {["list", "new"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t ? "#0b3a6e" : "transparent",
                color: tab === t ? "#fff" : "#6b7280",
              }}
            >
              {t === "list" ? "Solicitudes registradas" : "+ Nueva solicitud"}
            </button>
          ))}
        </div>

        {tab === "list" ? (
          <div className="space-y-3">
            {CASES.map(c => {
              const sc = STATUS_COLORS[c.estado];
              const Icon = sc.icon;
              return (
                <div key={c.id} className="bg-white rounded-xl border p-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e8eef6" }}>
                        <Baby className="w-5 h-5" style={{ color: "#0b3a6e" }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{c.nombre}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.edad} años · Tutor: {c.tutor}</div>
                        <div className="text-xs text-gray-400 mt-0.5">N° {c.id} · {c.fecha}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        <Icon className="w-3 h-3" /> {c.estado}
                      </span>
                    </div>
                  </div>

                  {c.estado === "Pendiente" && (
                    <div className="mt-4 flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-xs text-orange-700">Autorización notarial pendiente de carga. Suba el documento para continuar.</span>
                      <button
                        onClick={() => handleUpload(c.id)}
                        className="ml-auto text-xs px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1.5 flex-shrink-0"
                        style={{ backgroundColor: "#e67e22" }}
                      >
                        <Upload className="w-3 h-3" /> {uploadStatus[c.id] ? "Subido ✓" : "Cargar"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
            <h2 className="text-base font-semibold text-gray-900">Nueva solicitud de menor</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Nombre del menor", placeholder: "Nombre completo" },
                { label: "RUT del menor", placeholder: "12.345.678-9" },
                { label: "Fecha de nacimiento", placeholder: "", type: "date" },
                { label: "Nacionalidad", placeholder: "Chilena" },
                { label: "Nombre del tutor/responsable", placeholder: "Nombre del adulto acompañante" },
                { label: "RUT del tutor", placeholder: "12.345.678-9" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input type={f.type || "text"} placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Relación con el tutor</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50">
                <option>Padre / Madre (único)</option>
                <option>Abuelo/a</option>
                <option>Tío/a</option>
                <option>Otro familiar</option>
                <option>No familiar (con autorización)</option>
              </select>
            </div>

            {/* Document upload area */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">Carga de autorización notarial</label>
              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor: "#1b5fad" }}>
                <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: "#1b5fad" }} />
                <p className="text-sm font-medium text-gray-800">Arrastra el archivo aquí o haz clic para cargar</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG o PNG · Máx. 10MB · Resolución mínima 300 DPI</p>
                <button className="mt-4 px-4 py-2 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: "#0b3a6e" }}>
                  Seleccionar archivo
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 border rounded-xl p-4 flex items-center gap-3" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                <FileText className="w-8 h-8" style={{ color: "#1b5fad" }} />
                <div>
                  <p className="text-xs font-medium text-gray-800">Validación automática</p>
                  <p className="text-xs text-gray-500">El sistema verifica autenticidad vía Registro Civil</p>
                </div>
              </div>
              <div className="flex-1 border rounded-xl p-4 flex items-center gap-3" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                <Shield className="w-8 h-8" style={{ color: "#27ae60" }} />
                <div>
                  <p className="text-xs font-medium text-gray-800">Seguridad y privacidad</p>
                  <p className="text-xs text-gray-500">Datos protegidos bajo Ley 19.628</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <button className="px-6 py-2.5 rounded-lg text-sm text-white font-medium" style={{ backgroundColor: "#0b3a6e" }}>
                Enviar solicitud
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
