import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEED_USERS } from '../../data/seed';
import { ROLE_LABELS } from '../../types';

export function LoginPage() {
  const { login, sessionExpiredMessage, clearSessionMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    clearSessionMessage();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Error desconocido');
      }
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    clearSessionMessage();
    setLoading(true);
    setTimeout(() => {
      const result = login(userEmail, userPassword);
      if (!result.success) setError(result.error || '');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login">
      {/* Panel izquierdo - Info institucional */}
      <div className="login__info">
        <div>
          <div className="login__brand">
            <div className="login__brand-icon">
              <Shield size={24} color="white" />
            </div>
            <div>
              <div className="login__brand-sub">República de Chile</div>
              <div className="login__brand-name">Aduanas Inteligente</div>
            </div>
          </div>
          <div style={{ marginTop: '4rem' }}>
            <h1 className="login__title">
              Digitalización de<br />
              <strong>Trámites Aduaneros</strong>
            </h1>
            <p className="login__subtitle">
              Plataforma integrada de gestión aduanera terrestre para pasos
              fronterizos de Chile. Validación anticipada, trazabilidad completa.
            </p>
          </div>
        </div>
        <div className="login__stats">
          {[
            { label: 'Pasos fronterizos', value: '24 activos' },
            { label: 'Trámites hoy', value: '3.847' },
            { label: 'Tiempo promedio', value: '< 8 min' },
            { label: 'Validaciones SAG', value: '1.203' },
          ].map(s => (
            <div key={s.label} className="login__stat">
              <div className="login__stat-value">{s.value}</div>
              <div className="login__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="login__form-panel">
        <div className="login__form-wrapper">
          <div className="login__mobile-brand">
            <div className="login__brand-icon">
              <Shield size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(180,210,255,0.8)' }}>República de Chile</div>
              <div style={{ fontWeight: 600 }}>Aduanas Inteligente</div>
            </div>
          </div>

          <div className="login__card">
            <h2 className="login__card-title">Iniciar sesión</h2>
            <p className="login__card-sub">Acceso seguro al sistema de gestión aduanera</p>

            {sessionExpiredMessage && (
              <div className="login__error">
                <Shield size={16} />
                {sessionExpiredMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="login__field">
                <label className="login__field-label">RUT o correo institucional</label>
                <div className="login__input-wrap">
                  <User size={16} className="login__input-icon" />
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Ej: funcionario@aduanas.cl"
                    className="input input--with-icon"
                  />
                </div>
              </div>

              <div className="login__field">
                <label className="login__field-label">Contraseña</label>
                <div className="login__input-wrap">
                  <Lock size={16} className="login__input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input--with-icon"
                    style={{ paddingRight: 'var(--space-10)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login__input-action"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login__error">
                  <Shield size={16} style={{ flexShrink: 0 }} />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn--primary btn--full btn--lg">
                {loading ? <div className="spinner" /> : <>Iniciar sesión <ChevronRight size={16} /></>}
              </button>

              <button type="button" className="login__forgot">
                ¿Olvidó su contraseña? → Recuperar acceso
              </button>
            </form>

            <div className="login__demo">
              <p className="login__demo-label">Acceso de demostración</p>
              <div className="login__demo-grid">
                {SEED_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleDemoLogin(u.email, u.password)}
                    className="login__demo-btn"
                  >
                    {ROLE_LABELS[u.role]}
                  </button>
                ))}
              </div>
            </div>

            <div className="login__secure">
              <Lock size={12} />
              <span>Conexión cifrada TLS 1.3 · Acceso auditado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
