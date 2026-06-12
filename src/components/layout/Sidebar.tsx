import {
  LayoutDashboard, Plane, Baby, Leaf, Car, Search,
  Users, BarChart2, Settings, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS, type UserRole } from '../../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
}

const NAV_ITEMS: { id: string; label: string; icon: any; roles: UserRole[] }[] = [
  { id: 'dashboard',  label: 'Dashboard',            icon: LayoutDashboard, roles: ['viajero','aduanas','sag','pdi','admin'] },
  { id: 'nuevo-viaje', label: 'Nuevo Viaje',          icon: Plane,           roles: ['viajero','aduanas','admin'] },
  { id: 'menores',    label: 'Menores de Edad',       icon: Baby,            roles: ['viajero','aduanas','admin'] },
  { id: 'sag',        label: 'Declaración SAG',       icon: Leaf,            roles: ['viajero','sag','aduanas','admin'] },
  { id: 'vehiculos',  label: 'Registro Vehículos',    icon: Car,             roles: ['viajero','aduanas','admin'] },
  { id: 'seguimiento', label: 'Seguimiento',           icon: Search,          roles: ['viajero','aduanas','sag','pdi','admin'] },
  { id: 'portal-aduanas', label: 'Portal Aduanas',    icon: Users,           roles: ['aduanas','admin'] },
  { id: 'portal-sag', label: 'Portal SAG',             icon: Leaf,            roles: ['sag','admin'] },
  { id: 'portal-pdi', label: 'Control Migratorio',     icon: Shield,          roles: ['pdi','admin'] },
  { id: 'reportes',   label: 'Reportes',               icon: BarChart2,       roles: ['aduanas','admin'] },
  { id: 'admin',      label: 'Administración',         icon: Settings,        roles: ['admin'] },
];

const USER_INITIALS: Record<UserRole, string> = {
  viajero: 'JR', aduanas: 'FO', sag: 'SG', pdi: 'PM', admin: 'AD',
};

export function Sidebar({ currentPage, onNavigate, onClose }: SidebarProps) {
  const { user, role, logout } = useAuth();
  if (!user || !role) return null;

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  const handleNav = (page: string) => {
    onNavigate(page);
    onClose?.();
  };

  return (
    <div className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <Shield size={20} color="white" />
        </div>
        <div>
          <div className="sidebar__brand-name">Aduanas Inteligente</div>
          <div className="sidebar__brand-sub">Chile · Sistema Integrado</div>
        </div>
      </div>

      {/* Role */}
      <div className="sidebar__role">
        <div className="sidebar__role-dot" style={{ background: ROLE_COLORS[role] }} />
        <span className="sidebar__role-label">{ROLE_LABELS[role]}</span>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`sidebar__nav-item ${active ? 'sidebar__nav-item--active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {active && <ChevronRight size={12} className="sidebar__nav-chevron" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" style={{ background: ROLE_COLORS[role] }}>
            {USER_INITIALS[role]}
          </div>
          <div>
            <div className="sidebar__user-name">{user.nombre}</div>
            <div className="sidebar__user-detail">
              {role === 'viajero' ? `RUT ${user.rut}` : user.paso || user.email}
            </div>
          </div>
        </div>
        <button onClick={logout} className="sidebar__logout">
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
