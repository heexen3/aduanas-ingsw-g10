import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { SEED_USERS } from '../../data/seed';
import { ROLE_LABELS, type UserRole } from '../../types';
import { Users, ShieldAlert, FileText, Check, Shield } from 'lucide-react';

export function Administration() {
  const { auditLogs } = useTramites();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'permisos' | 'auditoria'>('usuarios');

  // Estado local para los usuarios de la demo (para poder activar/desactivar y cambiar de rol)
  const [usersList, setUsersList] = useState(SEED_USERS);
  const [actionMsg, setActionMsg] = useState('');

  const handleToggleActivo = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id !== id) return u;
      const nextState = !u.activo;
      // Registrar log si corresponde
      return { ...u, activo: nextState };
    }));
    setActionMsg('Estado del usuario actualizado correctamente.');
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleChangeRol = (id: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => {
      if (u.id !== id) return u;
      return { ...u, role: newRole };
    }));
    setActionMsg(`Rol del usuario actualizado. Sesión previa invalidada.`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div className="admin-panel">
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
          Panel de Administración del Sistema
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Gestión de accesos, políticas de seguridad y auditoría general.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`admin-tabs__btn ${activeTab === 'usuarios' ? 'admin-tabs__btn--active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Users size={16} />
          Gestión de Usuarios
        </button>
        <button
          onClick={() => setActiveTab('permisos')}
          className={`admin-tabs__btn ${activeTab === 'permisos' ? 'admin-tabs__btn--active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ShieldAlert size={16} />
          Roles y Permisos
        </button>
        <button
          onClick={() => setActiveTab('auditoria')}
          className={`admin-tabs__btn ${activeTab === 'auditoria' ? 'admin-tabs__btn--active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FileText size={16} />
          Auditoría de Actividad
        </button>
      </div>

      {actionMsg && (
        <div className="alert alert--success animate-fadeIn">
          <Check size={16} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* CONTENIDO TABS */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        {/* TAB 1: GESTIÓN DE USUARIOS */}
        {activeTab === 'usuarios' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo Institucional</th>
                  <th>RUN</th>
                  <th>Rol Asignado</th>
                  <th>Paso/Destacamento</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td>
                      <strong style={{ display: 'block', fontSize: 'var(--text-xs)' }}>{u.nombre}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>ID: {u.id}</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.rut}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={e => handleChangeRol(u.id, e.target.value as UserRole)}
                        className="input"
                        style={{ width: '130px', fontSize: '11px', padding: '3px 6px' }}
                        disabled={u.id === currentUser?.id} // No cambiarse rol a uno mismo
                      >
                        <option value="viajero">Viajero</option>
                        <option value="aduanas">Func. Aduanas</option>
                        <option value="sag">Func. SAG</option>
                        <option value="pdi">Func. PDI</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td>{u.paso || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.activo ? 'badge--success' : 'badge--danger'}`}>
                        {u.activo ? 'Activo' : 'Habilitación Revocada'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleActivo(u.id)}
                        disabled={u.id === currentUser?.id}
                        className={`btn ${u.activo ? 'btn--danger-outline' : 'btn--outline'}`}
                        style={{ padding: '2px 8px', fontSize: '10px', borderRadius: '4px' }}
                      >
                        {u.activo ? 'Deshabilitar' : 'Re-Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ROLES Y PERMISOS */}
        {activeTab === 'permisos' && (
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
              Matriz de Control de Acceso (RBAC)
            </h3>
            <div className="permisos-matrix">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Permiso del Sistema</th>
                    <th style={{ textAlign: 'center' }}>Viajero</th>
                    <th style={{ textAlign: 'center' }}>Func. Aduanas</th>
                    <th style={{ textAlign: 'center' }}>Func. SAG</th>
                    <th style={{ textAlign: 'center' }}>Func. PDI</th>
                    <th style={{ textAlign: 'center' }}>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { perm: 'Registrar solicitud de viaje terrestre', roles: ['viajero', 'aduanas', 'admin'] },
                    { perm: 'Realizar pre-declaración fitosanitaria', roles: ['viajero', 'sag', 'aduanas', 'admin'] },
                    { perm: 'Registrar patentes vehiculares', roles: ['viajero', 'aduanas', 'admin'] },
                    { perm: 'Aprobar o rechazar trámites aduaneros', roles: ['aduanas', 'admin'] },
                    { perm: 'Inspeccionar productos fitosanitarios', roles: ['sag', 'admin'] },
                    { perm: 'Consultar arraigos y órdenes judiciales PDI', roles: ['pdi', 'admin'] },
                    { perm: 'Auditar bitácoras y modificar roles', roles: ['admin'] },
                  ].map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.perm}</td>
                      {['viajero', 'aduanas', 'sag', 'pdi', 'admin'].map(r => (
                        <td key={r} style={{ textAlign: 'center' }}>
                          {p.roles.includes(r) ? (
                            <Check size={16} color="var(--color-success)" style={{ margin: '0 auto' }} />
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDITORÍA DE ACTIVIDAD */}
        {activeTab === 'auditoria' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Registro</th>
                  <th>Operador / Usuario</th>
                  <th>Acción Auditada</th>
                  <th>Dirección IP</th>
                  <th>Fecha y Hora</th>
                  <th>Clasificación</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>#{log.id}</td>
                    <td><strong>{log.usuario}</strong></td>
                    <td style={{ maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.accion}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{log.ip}</td>
                    <td>{log.fecha}</td>
                    <td>
                      <span className={`badge ${
                        log.tipo === 'aprobacion' ? 'badge--success' :
                        log.tipo === 'rechazo' ? 'badge--danger' :
                        log.tipo === 'administracion' ? 'badge--neutral' : 'badge--info'
                      }`}>
                        {log.tipo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
