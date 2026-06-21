import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, ChevronRight, Mail, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../types';

export function LoginPage() {
  const { login, sessionExpiredMessage, clearSessionMessage, registrarUsuario, users } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'recover'>('login');

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Register States
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRut, setRegRut] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Recover States
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const [recoveredUser, setRecoveredUser] = useState<{ nombre: string; password: string } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regNombre || !regEmail || !regRut || !regPassword || !regPasswordConfirm) {
      setRegError('Todos los campos son obligatorios.');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const result = registrarUsuario(regNombre, regEmail, regPassword, regRut, 'viajero');
    if (result.success) {
      setRegSuccess('¡Registro exitoso! Ya puede iniciar sesión.');
      setRegNombre('');
      setRegEmail('');
      setRegRut('');
      setRegPassword('');
      setRegPasswordConfirm('');
      setTimeout(() => {
        setView('login');
        setEmail(regEmail);
        setRegSuccess('');
      }, 2000);
    } else {
      setRegError(result.error || 'Error al registrar.');
    }
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError('');
    setRecoveredUser(null);

    if (!recoverEmail) {
      setRecoverError('Ingrese su correo electrónico.');
      return;
    }

    const found = users.find(u => u.email.toLowerCase() === recoverEmail.toLowerCase());
    if (found) {
      setRecoveredUser({ nombre: found.nombre, password: found.password });
    } else {
      setRecoverError('El correo electrónico no se encuentra registrado en el sistema.');
    }
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
            {/* VISTA LOGIN */}
            {view === 'login' && (
              <>
                <h2 className="login__card-title">Iniciar sesión</h2>
                <p className="login__card-sub">Acceso seguro al sistema de gestión aduanera</p>

                {sessionExpiredMessage && (
                  <div className="login__error" id="session-expired-msg">
                    <Shield size={16} />
                    {sessionExpiredMessage}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="login__field">
                    <label className="login__field-label">RUT o correo institucional</label>
                    <div className="login__input-wrap">
                      <User size={16} className="login__input-icon" />
                      <input
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ej: viajero@aduanas.cl o funcionario@aduanas.cl"
                        className="input input--with-icon"
                        id="login-email-input"
                        required
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
                        id="login-password-input"
                        required
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
                    <div className="login__error" id="login-error-message">
                      <Shield size={16} style={{ flexShrink: 0 }} />
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn btn--primary btn--full btn--lg" id="login-submit-btn">
                    {loading ? <div className="spinner" /> : <>Iniciar sesión <ChevronRight size={16} /></>}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
                    <button type="button" onClick={() => { setView('recover'); setRecoverError(''); setRecoveredUser(null); }} className="login__forgot" style={{ margin: 0, padding: 0 }} id="toggle-recover-btn">
                      ¿Olvidó su contraseña?
                    </button>
                    <button type="button" onClick={() => { setView('register'); setRegError(''); setRegSuccess(''); }} className="login__forgot" style={{ margin: 0, padding: 0, color: 'var(--color-primary-light)', fontWeight: 600 }} id="toggle-register-btn">
                      Crear una cuenta viajero →
                    </button>
                  </div>
                </form>

                <div className="login__demo">
                  <p className="login__demo-label">Acceso de demostración</p>
                  <div className="login__demo-grid">
                    {users.slice(0, 5).map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleDemoLogin(u.email, u.password)}
                        className="login__demo-btn"
                        id={`demo-login-btn-${u.role}`}
                      >
                        {ROLE_LABELS[u.role]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* VISTA REGISTRO */}
            {view === 'register' && (
              <div className="animate-fadeIn">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <button type="button" onClick={() => setView('login')} style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="login__card-title" style={{ margin: 0 }}>Crear cuenta</h2>
                </div>
                <p className="login__card-sub" style={{ marginBottom: 'var(--space-4)' }}>Regístrese como Viajero para declarar y seguir sus trámites</p>

                {regSuccess && (
                  <div className="alert alert--success animate-fadeIn" style={{ marginBottom: 'var(--space-4)' }} id="register-success-message">
                    <Check size={16} />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit}>
                  <div className="login__field">
                    <label className="login__field-label">Nombre completo</label>
                    <div className="login__input-wrap">
                      <User size={16} className="login__input-icon" />
                      <input
                        type="text"
                        value={regNombre}
                        onChange={e => setRegNombre(e.target.value)}
                        placeholder="Ej: Pedro Test Muñoz"
                        className="input input--with-icon"
                        required
                        id="register-name-input"
                      />
                    </div>
                  </div>

                  <div className="login__field">
                    <label className="login__field-label">Correo electrónico</label>
                    <div className="login__input-wrap">
                      <Mail size={16} className="login__input-icon" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="Ej: pedro.test@aduanas.cl"
                        className="input input--with-icon"
                        required
                        id="register-email-input"
                      />
                    </div>
                  </div>

                  <div className="login__field">
                    <label className="login__field-label">RUN / RUT</label>
                    <div className="login__input-wrap">
                      <CreditCard size={16} className="login__input-icon" />
                      <input
                        type="text"
                        value={regRut}
                        onChange={e => setRegRut(e.target.value)}
                        placeholder="Ej: 18.888.888-8"
                        className="input input--with-icon"
                        required
                        id="register-rut-input"
                      />
                    </div>
                  </div>

                  <div className="login__field">
                    <label className="login__field-label">Contraseña</label>
                    <div className="login__input-wrap">
                      <Lock size={16} className="login__input-icon" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="input input--with-icon"
                        required
                        id="register-password-input"
                      />
                    </div>
                  </div>

                  <div className="login__field">
                    <label className="login__field-label">Confirmar Contraseña</label>
                    <div className="login__input-wrap">
                      <Lock size={16} className="login__input-icon" />
                      <input
                        type="password"
                        value={regPasswordConfirm}
                        onChange={e => setRegPasswordConfirm(e.target.value)}
                        placeholder="Repita la contraseña"
                        className="input input--with-icon"
                        required
                        id="register-confirm-password-input"
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="login__error" style={{ marginBottom: 'var(--space-3)' }} id="register-error-message">
                      <Shield size={16} style={{ flexShrink: 0 }} />
                      {regError}
                    </div>
                  )}

                  <button type="submit" className="btn btn--primary btn--full btn--lg" id="register-submit-btn">
                    Crear Cuenta
                  </button>

                  <button type="button" onClick={() => setView('login')} className="btn btn--outline btn--full" style={{ marginTop: 'var(--space-2)' }}>
                    Volver al inicio de sesión
                  </button>
                </form>
              </div>
            )}

            {/* VISTA RECUPERACIÓN */}
            {view === 'recover' && (
              <div className="animate-fadeIn">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                  <button type="button" onClick={() => setView('login')} style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="login__card-title" style={{ margin: 0 }}>Recuperar clave</h2>
                </div>
                <p className="login__card-sub" style={{ marginBottom: 'var(--space-4)' }}>Ingrese su correo para recuperar su contraseña</p>

                {recoveredUser && (
                  <div className="alert alert--success animate-fadeIn" style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} id="recover-success-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <Check size={16} />
                      <span>¡Cuenta encontrada!</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', width: '100%' }}>
                      <p><strong>Usuario:</strong> {recoveredUser.nombre}</p>
                      <p><strong>Contraseña:</strong> <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '3px' }}>{recoveredUser.password}</span></p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRecoverSubmit}>
                  <div className="login__field">
                    <label className="login__field-label">Correo electrónico registrado</label>
                    <div className="login__input-wrap">
                      <Mail size={16} className="login__input-icon" />
                      <input
                        type="email"
                        value={recoverEmail}
                        onChange={e => setRecoverEmail(e.target.value)}
                        placeholder="Ej: viajero@aduanas.cl"
                        className="input input--with-icon"
                        required
                        id="recover-email-input"
                      />
                    </div>
                  </div>

                  {recoverError && (
                    <div className="login__error" style={{ marginBottom: 'var(--space-3)' }} id="recover-error-message">
                      <Shield size={16} style={{ flexShrink: 0 }} />
                      {recoverError}
                    </div>
                  )}

                  <button type="submit" className="btn btn--primary btn--full btn--lg" id="recover-submit-btn">
                    Recuperar Acceso
                  </button>

                  <button type="button" onClick={() => setView('login')} className="btn btn--outline btn--full" style={{ marginTop: 'var(--space-2)' }}>
                    Volver al inicio de sesión
                  </button>
                </form>
              </div>
            )}

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
