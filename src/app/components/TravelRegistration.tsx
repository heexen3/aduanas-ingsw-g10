import { useState } from "react";
import { Plane, Plus, Trash2, CheckCircle2, Upload, User, Calendar, MapPin, Users } from "lucide-react";

const PASOS = [
  "Los Libertadores (Mendoza)", "Chacalluta (Arica)", "Cardenal Samoré (Osorno)",
  "Pino Hachado (Lonquimay)", "Colchane (Colchane)", "Jama (San Pedro de Atacama)",
  "Sico (Antofagasta)", "San Francisco (Copiapó)", "Pehuenche (Talca)",
];

const DOCUMENTOS = [
  { id: "pasaporte", label: "Pasaporte o Cédula de Identidad", obligatorio: true },
  { id: "seguros", label: "Seguro de viaje (recomendado)", obligatorio: false },
  { id: "vacunas", label: "Certificado de vacunación COVID-19", obligatorio: false },
  { id: "vehiculo", label: "Documentación del vehículo", obligatorio: false },
];

export function TravelRegistration() {
  const [step, setStep] = useState(1);
  const [familyMembers, setFamilyMembers] = useState([{ name: "", rut: "", relationship: "" }]);
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const addMember = () => setFamilyMembers([...familyMembers, { name: "", rut: "", relationship: "" }]);
  const removeMember = (i: number) => setFamilyMembers(familyMembers.filter((_, idx) => idx !== i));

  const handleSubmit = () => { setSubmitted(true); };

  if (submitted) {
    return (
      <div className="p-7 max-w-xl mx-auto text-center">
        <div className="bg-white rounded-2xl p-10 border" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#dcfce7" }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: "#15803d" }} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Registro completado</h2>
          <p className="text-gray-500 text-sm mb-6">Su trámite fue registrado exitosamente</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">N° de trámite</span><span className="font-mono font-semibold text-gray-900">ADN-2024-1548</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Paso fronterizo</span><span className="text-gray-900">Los Libertadores</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Fecha de viaje</span><span className="text-gray-900">15 Jun 2024</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Estado</span><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}>En validación</span></div>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-lg text-sm text-white font-medium"
            style={{ backgroundColor: "#0b3a6e" }}
          >
            Nuevo registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Plane className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Registro de Viaje
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete la información antes de su paso fronterizo</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { n: 1, label: "Datos personales" },
            { n: 2, label: "Grupo familiar" },
            { n: 3, label: "Documentación" },
            { n: 4, label: "Confirmar" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: step > s.n ? "#27ae60" : step === s.n ? "#0b3a6e" : "#e8eef6",
                    color: step >= s.n ? "#fff" : "#6b7280",
                  }}
                >
                  {step > s.n ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.n}
                </div>
                <span className={`text-xs hidden sm:block ${step === s.n ? "text-gray-900 font-medium" : "text-gray-400"}`}>{s.label}</span>
              </div>
              {i < 3 && <div className="flex-1 h-px" style={{ backgroundColor: step > s.n ? "#27ae60" : "rgba(11,58,110,0.12)" }} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4" style={{ color: "#0b3a6e" }} />Datos personales</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Nombre completo", placeholder: "Juan Carlos Rodríguez Soto" },
                  { label: "RUT / Pasaporte", placeholder: "12.345.678-9" },
                  { label: "Nacionalidad", placeholder: "Chilena" },
                  { label: "Fecha de nacimiento", placeholder: "01/01/1985", type: "date" },
                  { label: "Correo electrónico", placeholder: "juan@email.com", type: "email" },
                  { label: "Teléfono de contacto", placeholder: "+56 9 1234 5678" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input type={f.type || "text"} placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5"><MapPin className="inline w-3 h-3 mr-1" />Paso fronterizo de salida/ingreso</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50">
                    <option value="">Seleccione un paso</option>
                    {PASOS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5"><Calendar className="inline w-3 h-3 mr-1" />Fecha estimada de viaje</label>
                  <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Destino</label>
                <input type="text" placeholder="Ciudad y país de destino (ej: Mendoza, Argentina)"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Motivo del viaje</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50">
                  <option>Turismo</option>
                  <option>Negocios</option>
                  <option>Visita familiar</option>
                  <option>Tránsito</option>
                  <option>Estudios</option>
                  <option>Otro</option>
                </select>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Users className="w-4 h-4" style={{ color: "#0b3a6e" }} />Grupo familiar</h2>
              <p className="text-xs text-gray-500">Agregue a los acompañantes que viajan con usted</p>
              <div className="space-y-3">
                {familyMembers.map((m, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-3" style={{ borderColor: "rgba(11,58,110,0.1)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">Acompañante {i + 1}</span>
                      {i > 0 && (
                        <button onClick={() => removeMember(i)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre completo</label>
                        <input type="text" placeholder="Nombre del acompañante"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">RUT / Pasaporte</label>
                        <input type="text" placeholder="12.345.678-9"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Parentesco</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50">
                          <option>Cónyuge</option>
                          <option>Hijo/a</option>
                          <option>Padre/Madre</option>
                          <option>Hermano/a</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addMember}
                className="flex items-center gap-2 text-sm border border-dashed rounded-xl px-4 py-3 w-full justify-center transition-colors hover:bg-blue-50"
                style={{ borderColor: "#1b5fad", color: "#1b5fad" }}
              >
                <Plus className="w-4 h-4" /> Agregar acompañante
              </button>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Upload className="w-4 h-4" style={{ color: "#0b3a6e" }} />Documentación requerida</h2>
              <div className="space-y-3">
                {DOCUMENTOS.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-xl" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={doc.id}
                        checked={!!docs[doc.id]}
                        onChange={e => setDocs({ ...docs, [doc.id]: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor={doc.id} className="text-sm text-gray-800">
                        {doc.label}
                        {doc.obligatorio && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}>Obligatorio</span>}
                      </label>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-blue-50" style={{ borderColor: "#1b5fad", color: "#1b5fad" }}>
                      Cargar
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: "#27ae60" }} />Confirmación</h2>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                {[
                  ["Titular", "Juan Carlos Rodríguez Soto"],
                  ["RUT", "12.345.678-9"],
                  ["Paso fronterizo", "Los Libertadores (Mendoza)"],
                  ["Fecha de viaje", "15 Junio 2024"],
                  ["Acompañantes", `${familyMembers.length} persona(s)`],
                  ["Motivo", "Turismo"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  Al confirmar, acepta que los datos proporcionados son verídicos. La información será enviada a los organismos de control aduanero.
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-5 py-2.5 rounded-lg text-sm border font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: "#0b3a6e", color: "#0b3a6e" }}
            >
              Anterior
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-lg text-sm text-white font-medium"
                style={{ backgroundColor: "#0b3a6e" }}
              >
                Continuar →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg text-sm text-white font-medium"
                style={{ backgroundColor: "#27ae60" }}
              >
                Confirmar registro ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
