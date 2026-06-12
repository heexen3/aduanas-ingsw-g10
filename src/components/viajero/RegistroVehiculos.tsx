import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { Car, Upload, FileText, Check, QrCode } from 'lucide-react';

export function RegistroVehiculos() {
  const { crearTramite } = useTramites();
  const { user } = useAuth();

  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [color, setColor] = useState('');
  const [propietario, setPropietario] = useState('');
  const [rutPropietario, setRutPropietario] = useState('');
  const [operacion, setOperacion] = useState<'salida' | 'ingreso'>('salida');

  const [padronAdjunto, setPadronAdjunto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patente || !marca || !modelo || !anio || !propietario || !rutPropietario || !padronAdjunto) return;

    setSubmitting(true);
    setTimeout(() => {
      if (user) {
        crearTramite({
          viajero: { nombre: user.nombre, rut: user.rut, email: user.email },
          tipo: 'vehiculo',
          estado: 'pendiente',
          pasoFronterizo: user.paso || 'Los Libertadores (Mendoza)',
          fechaViaje: 'Hoy',
          destino: 'Trámite Standalone',
          motivo: 'Salida/Ingreso Temporal de Vehículo',
          acompanantes: [],
          menores: [],
          vehiculo: { patente, marca, modelo, anio, color, propietario, rutPropietario, operacion, tipo: 'Particular' },
          declaracionSAG: null,
          documentos: ['Formulario vehicular ✓', 'Padrón Vehicular ✓'],
          observaciones: '',
          prioridad: 'normal'
        });
      }
      setQrCodeData(`ADUANA-VEH-${patente.replace(/[-]/g, '').toUpperCase()}`);
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="registro-vehiculos">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
          <Car size={24} color="var(--color-primary-light)" />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Registro y Control de Vehículos Particulares
          </h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Complete los datos del vehículo para obtener el pase de aduana (Salida / Admisión Temporal).
            </p>

            <div className="form-grid">
              <div>
                <label className="label">Patente (Formato: AAAA-00 o AA-0000)</label>
                <input
                  type="text"
                  value={patente}
                  onChange={e => setPatente(e.target.value)}
                  placeholder="Ej: ABCD-12"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Operación Vehicular</label>
                <select
                  value={operacion}
                  onChange={e => setOperacion(e.target.value as 'salida' | 'ingreso')}
                  className="input"
                >
                  <option value="salida">Salida Temporal (Chile al extranjero)</option>
                  <option value="ingreso">Ingreso Temporal (Extranjero a Chile)</option>
                </select>
              </div>

              <div>
                <label className="label">Marca</label>
                <input
                  type="text"
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                  placeholder="Ej: Toyota"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Modelo</label>
                <input
                  type="text"
                  value={modelo}
                  onChange={e => setModelo(e.target.value)}
                  placeholder="Ej: Rav4"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Año</label>
                <input
                  type="text"
                  value={anio}
                  onChange={e => setAnio(e.target.value)}
                  placeholder="Ej: 2020"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="Ej: Gris Metálico"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Nombre del Propietario</label>
                <input
                  type="text"
                  value={propietario}
                  onChange={e => setPropietario(e.target.value)}
                  placeholder="Nombre completo"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">RUN del Propietario</label>
                <input
                  type="text"
                  value={rutPropietario}
                  onChange={e => setRutPropietario(e.target.value)}
                  placeholder="Ej: 15.234.876-K"
                  className="input"
                  required
                />
              </div>

              <div className="form-grid--full">
                <label className="label">Adjuntar Padrón Vehicular (PDF/Imagen)</label>
                {padronAdjunto ? (
                  <div className="alert alert--success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} /> padron_vehiculo.pdf
                    </span>
                    <button type="button" onClick={() => setPadronAdjunto(false)} style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '11px' }}>
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="file-upload" onClick={() => setPadronAdjunto(true)}>
                    <Upload size={20} className="file-upload__icon" />
                    <div className="file-upload__label">Presione para cargar el padrón vehicular</div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn--primary btn--full"
              style={{ marginTop: 'var(--space-2)' }}
            >
              {submitting ? <div className="spinner" /> : 'Registrar Vehículo en Aduanas'}
            </button>
          </form>
        ) : (
          <div className="vehiculo-ficha animate-fadeIn">
            <div className="vehiculo-ficha__header">
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
                  COMPROBANTE ADUANERO
                </h3>
                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                  Pase Único de Cruce Fronterizo Terrestre
                </span>
              </div>
              <div className="vehiculo-ficha__plate">{patente.toUpperCase()}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-5)' }}>
              <div>
                <strong>Vehículo:</strong> {marca} {modelo} ({anio}) - {color}
              </div>
              <div>
                <strong>Operación:</strong> {operacion === 'salida' ? 'Salida Temporal de Chile' : 'Admisión Temporal a Chile'}
              </div>
              <div>
                <strong>Propietario:</strong> {propietario}
              </div>
              <div>
                <strong>RUN Propietario:</strong> {rutPropietario}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
              <QrCode size={100} color="var(--color-primary)" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{qrCodeData}</span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px', textAlign: 'center' }}>
                Presente este comprobante con el código QR en la cabina de control aduanero para el escaneo.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setPatente('');
                setMarca('');
                setModelo('');
                setAnio('');
                setColor('');
                setPropietario('');
                setRutPropietario('');
                setPadronAdjunto(false);
                setQrCodeData(null);
              }}
              className="btn btn--outline btn--full"
              style={{ marginTop: 'var(--space-5)' }}
            >
              Registrar Otro Vehículo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
