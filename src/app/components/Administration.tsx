import { useState } from "react";
import { Settings, Users, Shield, Activity, Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";

const USUARIOS = [
  { id: 1, nombre: "Felipe Ortega", email: "fortega@aduanas.cl", rol: "Funcionario Aduanas", paso: "Los Libertadores", activo: true, ultimo: "Hoy 15:42" },
  { id: 2, nombre: "Sara González", email: "sgonzalez@sag.gob.cl", rol: "Funcionario SAG", paso: "Chacalluta", activo: true, ultimo: "Hoy 14:20" },
  { id: 3, nombre: "Pablo Moreno", email: "pmoreno@pdi.cl", rol: "Funcionario PDI", paso: "Los Libertadores", activo: true, ultimo: "Hoy 13:05" },
  { id: 4, nombre: "Lucía Fuentes", email: "lfuentes@aduanas.cl", rol: "Supervisor", paso: "Pino Hachado", activo: false, ultimo: "Ayer 09:30" },
  { id: 5, nombre: "Cristóbal Vera", email: "cvera@aduanas.cl", rol: "Funcionario Aduanas", paso: "Cardenal Samoré", activo: true, ultimo: "Hoy 11:15" },
];

const BITACORA = [
  { id: 1, usuario: "Felipe Ortega", accion: "Aprobó solicitud ADN-2024-1547", ip: "192.168.1.45", fecha: "10 Jun 2024 · 15:42", tipo: "Aprobación" },
  { id: 2, usuario: "Admin Sistema", accion: "Creó usuario: Cristóbal Vera (Func. Aduanas)", ip: "192.168.1.1", fecha: "10 Jun 2024 · 14:00", tipo: "Administración" },
  { id: 3, usuario: "Sara González", accion: "Inspeccionó declaración SAG-2024-0844", ip: "192.168.1.67", fecha: "10 Jun 2024 · 13:30", tipo: "Revisión" },
  { id: 4, usuario: "Lucía Fuentes", accion: "Rechazó solicitud ADN-2024-1539", ip: "192.168.1.89", fecha: "9 Jun 2024 · 09:30", tipo: "Rechazo" },
  { id: 5, usuario: "Pablo Moreno", accion: "Validó identidad vía PDI-Interpol", ip: "192.168.1.90", fecha: "10 Jun 2024 · 10:45", tipo: "Validación" },
];

const ROL_COLORS: Record<string, { bg: string; text: string }> = {
  "Funcionario Aduanas": { bg: "#dbeafe", text: "#1d4ed8" },
  "Funcionario SAG": { bg: "#dcfce7", text: "#15803d" },
  "Funcionario PDI": { bg: "#fce7f3", text: "#9d174d" },
  "Supervisor": { bg: "#fef3c7", text: "#92400e" },
  "Administrador": { bg: "#f3e8ff", text: "#6d28d9" },
};

const TIPO_LOG_COLORS: Record<string, { bg: string; text: string }> = {
  "Aprobación": { bg: "#dcfce7", text: "#15803d" },
  "Rechazo": { bg: "#fee2e2", text: "#b91c1c" },
  "Administración": { bg: "#f3e8ff", text: "#6d28d9" },
  "Revisión": { bg: "#dbeafe", text: "#1d4ed8" },
  "Validación": { bg: "#fef3c7", text: "#92400e" },
};

const PERMISOS = [
  { nombre: "Aprobar trámites", roles: ["Funcionario Aduanas", "Supervisor", "Administrador"] },
  { nombre: "Rechazar trámites", roles: ["Funcionario Aduanas", "Supervisor", "Administrador"] },
  { nombre: "Ver reportes", roles: ["Supervisor", "Administrador"] },
  { nombre: "Gestionar usuarios", roles: ["Administrador"] },
  { nombre: "Auditoría del sistema", roles: ["Administrador"] },
  { nombre: "Configurar integraciones", roles: ["Administrador"] },
];

export function Administration() {
  const [tab, setTab] = useState<"users" | "roles" | "audit">("users");
  const [search, setSearch] = useState("");
  const [activos, setActivos] = useState<Record<number, boolean>>(Object.fromEntries(USUARIOS.map(u => [u.id, u.activo])));

  const filtered = USUARIOS.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 lg:p-7">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" style={{ color: "#0b3a6e" }} /> Administración del Sistema
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de usuarios, roles, permisos y auditoría</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: "users", label: "Usuarios", icon: Users },
            { id: "roles", label: "Roles y permisos", icon: Shield },
            { id: "audit", label: "Bitácora", icon: Activity },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: tab === t.id ? "#0b3a6e" : "transparent",
                  color: tab === t.id ? "#fff" : "#6b7280",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Users tab */}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white font-medium" style={{ backgroundColor: "#0b3a6e" }}>
                <Plus className="w-4 h-4" /> Nuevo usuario
              </button>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafd" }}>
                    {["Usuario", "Correo", "Rol", "Paso asignado", "Último acceso", "Estado", "Acciones"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const rc = ROL_COLORS[u.rol] ?? { bg: "#e8eef6", text: "#0b3a6e" };
                    return (
                      <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: "#1b5fad" }}>
                              {u.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{u.nombre}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={rc}>{u.rol}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{u.paso}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{u.ultimo}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setActivos(p => ({ ...p, [u.id]: !p[u.id] }))} className="flex items-center gap-1.5">
                            {activos[u.id]
                              ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-xs text-green-600">Activo</span></>
                              : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Inactivo</span></>}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roles tab */}
        {tab === "roles" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                <h3 className="text-sm font-semibold text-gray-900">Matriz de permisos por rol</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafd" }}>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Permiso</th>
                      {["Func. Aduanas", "Func. SAG", "Func. PDI", "Supervisor", "Administrador"].map(r => (
                        <th key={r} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISOS.map((p, i) => (
                      <tr key={p.nombre} className="border-t" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
                        <td className="px-5 py-3 text-sm text-gray-800">{p.nombre}</td>
                        {["Funcionario Aduanas", "Funcionario SAG", "Funcionario PDI", "Supervisor", "Administrador"].map(r => (
                          <td key={r} className="px-4 py-3 text-center">
                            {p.roles.includes(r)
                              ? <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: "#dcfce7" }}><span className="block text-center text-xs leading-5" style={{ color: "#15803d" }}>✓</span></span>
                              : <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: "#f3f4f6" }}><span className="block text-center text-xs leading-5 text-gray-300">–</span></span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit tab */}
        {tab === "audit" && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
              <h3 className="text-sm font-semibold text-gray-900">Bitácora de actividades</h3>
              <span className="text-xs text-gray-400">Últimas 24 horas</span>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(11,58,110,0.06)" }}>
              {BITACORA.map(entry => {
                const tc = TIPO_LOG_COLORS[entry.tipo] ?? { bg: "#e8eef6", text: "#0b3a6e" };
                return (
                  <div key={entry.id} className="px-5 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: "#1b5fad" }}>
                        {entry.usuario.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{entry.usuario}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{entry.accion}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">IP: {entry.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={tc}>{entry.tipo}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{entry.fecha}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
