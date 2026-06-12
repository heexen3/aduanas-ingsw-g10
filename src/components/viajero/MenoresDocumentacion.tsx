import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { Baby, Upload, FileText, Check, AlertCircle } from 'lucide-react';

export function MenoresDocumentacion() {
  const { crearTramite } = useTramites();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [edad, setEdad] = useState(10);
  const [relacion, setRelacion] = useState('Hijo');

  const [docAdjunto, setDocAdjunto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !rut || !docAdjunto) return;

    setSubmitting(true);
    setTimeout(() => {
      if (user) {
        crearTramite({
          viajero: { nombre: user.nombre, rut: user.rut, email: user.email },
          tipo: 'menor',
          estado: 'pendiente',
          pasoFronterizo: user.paso || 'Los Libertadores (Mendoza)',
          fechaViaje: 'Hoy',
          destino: 'Trámite Standalone',
          motivo: 'Salida de Menor de Edad',
          acompanantes: [],
          menores: [{ nombre, rut, edad, relacion, docAdjunto }],
          vehiculo: null,
          declaracionSAG: null,
          documentos: ['Autorización Notarial Menor ✓', 'Libreta de Familia (copia) ✓'],
          observaciones: '',
          prioridad: 'urgente'
        });
      }
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="menores">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
          <Baby size={24} color="var(--color-role-admin)" />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Acreditación y Salida de Menores de Edad
          </h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Por la seguridad nacional y normativa vigente, la salida de menores de 18 años requiere la carga y validación de una Autorización Notarial digitalizada o de la firma de ambos padres.
            </p>

            <div className="form-grid">
              <div>
                <label className="label">Nombre completo del menor</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Juanito Pérez"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">RUN / Pasaporte del menor</label>
                <input
                  type="text"
                  value={rut}
                  onChange={e => setRut(e.target.value)}
                  placeholder="Ej: 22.345.678-9"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Edad (años)</label>
                <input
                  type="number"
                  value={edad}
                  onChange={e => setEdad(parseInt(e.target.value) || 0)}
                  placeholder="10"
                  className="input"
                  min={0}
                  max={17}
                  required
                />
              </div>

              <div>
                <label className="label">Relación o Vínculo del Tutor</label>
                <select
                  value={relacion}
                  onChange={e => setRelacion(e.target.value)}
                  className="input"
                >
                  <option value="Hijo">Hijo / Hija</option>
                  <option value="Sobrino">Sobrino / Sobrina</option>
                  <option value="Nieto">Nieto / Nieta</option>
                  <option value="Tutelado">Tutelado bajo custodia legal</option>
                </select>
              </div>

              <div className="form-grid--full">
                <label className="label">Adjuntar Autorización Notarial (PDF de escritura pública digitalizada)</label>
                {docAdjunto ? (
                  <div className="alert alert--success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} /> autorizacion_notarial_firmada.pdf
                    </span>
                    <button type="button" onClick={() => setDocAdjunto(false)} style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '11px' }}>
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="file-upload" onClick={() => setDocAdjunto(true)}>
                    <Upload size={20} className="file-upload__icon" />
                    <div className="file-upload__label">Presione para cargar autorización firmada por Notario</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Obligatorio para habilitar el cruce fronterizo</div>
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
              {submitting ? <div className="spinner" /> : 'Registrar Acreditación del Menor'}
            </button>
          </form>
        ) : (
          <div className="animate-fadeIn" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <div style={{ width: '4rem', height: '4rem', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4) auto' }}>
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
              Acreditación Registrada Exitosamente
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', maxWidth: '24rem', margin: 'var(--space-2) auto 0 auto' }}>
              Los documentos de autorización del menor {nombre} han sido inyectados en la base de control migratorio de la PDI. Su validación se reflejará en el Seguimiento de Trámites.
            </p>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setNombre('');
                setRut('');
                setEdad(10);
                setRelacion('Hijo');
                setDocAdjunto(false);
              }}
              className="btn btn--outline"
              style={{ marginTop: 'var(--space-6)' }}
            >
              Acreditar Otro Menor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
