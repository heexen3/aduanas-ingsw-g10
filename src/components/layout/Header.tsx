import { useState } from 'react';
import { Bell, X, CheckCircle2, Menu, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '../../types';

interface HeaderProps {
  pageTitle: string;
  onMenuToggle: () => void;
}

const NOTIFICATIONS = [
  { id: 1, text: 'Trámite #ADN-2026-1001 aprobado', time: 'hace 5 min', type: 'success' as const },
  { id: 2, text: 'Documentación pendiente de revisión SAG', time: 'hace 22 min', type: 'warning' as const },
  { id: 3, text: 'Nuevo paso fronterizo habilitado: Pino Hachado', time: 'hace 1h', type: 'info' as const },
];

export function Header({ pageTitle, onMenuToggle }: HeaderProps) {
  const { role } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div>
          <div className="header__page-title">{pageTitle}</div>
          <div className="header__date">
            {new Date().toLocaleDateString('es-CL', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
        </div>
      </div>

      <div className="header__right">
        {/* Notifications */}
        <div className="header__notif">
          <button className="header__notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={18} />
            <span className="header__notif-dot" />
          </button>
          {notifOpen && (
            <div className="header__notif-dropdown animate-fadeIn">
              <div className="header__notif-header">
                <span>Notificaciones</span>
                <button onClick={() => setNotifOpen(false)}><X size={16} /></button>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="header__notif-item">
                  <CheckCircle2
                    size={16}
                    style={{ flexShrink: 0, marginTop: 2 }}
                    color={n.type === 'success' ? 'var(--color-success)' : n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'}
                  />
                  <div>
                    <div className="header__notif-text">{n.text}</div>
                    <div className="header__notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role badge */}
        {role && (
          <div className="header__role-badge" style={{ background: ROLE_COLORS[role] }}>
            <Shield size={12} />
            {ROLE_LABELS[role]}
          </div>
        )}
      </div>
    </header>
  );
}
