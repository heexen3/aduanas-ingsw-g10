import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, User, ChevronRight } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: string) => void;
}

const DEMO_USERS = [
  { label: "Viajero / Turista", username: "viajero@aduanas.cl", password: "viajero123", role: "traveler" },
  { label: "Funcionario Aduanas", username: "funcionario@aduanas.cl", password: "func123", role: "official" },
  { label: "Funcionario SAG", username: "sag@aduanas.cl", password: "sag123", role: "sag" },
  { label: "Administrador", username: "admin@aduanas.cl", password: "admin123", role: "admin" },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user.role);
      } else {
        setError("Credenciales incorrectas. Intente nuevamente.");
      }
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = (role: string) => {
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(135deg, #0b3a6e 0%, #0e4a8a 50%, #1b5fad 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-200 mb-0.5">República de Chile</div>
              <div className="font-semibold text-lg leading-tight">Aduanas Inteligente</div>
            </div>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-light leading-tight mb-6" style={{ fontFamily: "'Source Serif 4', serif" }}>
              Digitalización de<br />
              <span className="font-semibold">Trámites Aduaneros</span>
            </h1>
            <p className="text-blue-200 text-base leading-relaxed max-w-sm">
              Plataforma integrada de gestión aduanera terrestre para pasos fronterizos de Chile. Validación anticipada, trazabilidad completa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Pasos fronterizos", value: "24 activos" },
            { label: "Trámites hoy", value: "3.847" },
            { label: "Tiempo promedio", value: "< 8 min" },
            { label: "Validaciones SAG", value: "1.203" },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-lg p-4 border border-white/10">
              <div className="text-xl font-semibold">{s.value}</div>
              <div className="text-blue-200 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <div className="text-xs text-blue-200">República de Chile</div>
              <div className="font-semibold">Aduanas Inteligente</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Iniciar sesión</h2>
              <p className="text-sm text-gray-500">Acceso seguro al sistema de gestión aduanera</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">RUT o correo institucional</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Ej: funcionario@aduanas.cl"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                    style={{ focusRingColor: "#1b5fad" } as any}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: "#0b3a6e" }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Iniciar sesión <ChevronRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="text-center">
                <button type="button" className="text-xs hover:underline" style={{ color: "#1b5fad" }}>
                  ¿Olvidó su contraseña? → Recuperar acceso
                </button>
              </div>
            </form>

            {/* Demo access */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Acceso de demostración</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_USERS.map(u => (
                  <button
                    key={u.role}
                    onClick={() => handleDemoLogin(u.role)}
                    className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all text-left"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>Conexión cifrada TLS 1.3 · Acceso auditado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
