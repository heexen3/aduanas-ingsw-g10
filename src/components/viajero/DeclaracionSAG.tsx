import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Check, AlertTriangle, ShieldCheck, QrCode } from 'lucide-react';

export function DeclaracionSAG() {
  const { crearTramite } = useTramites();
  const { user } = useAuth();
  const [traeProductos, setTraeProductos] = useState<boolean | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (traeProductos === null) return;
    if (traeProductos && !descripcion.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      if (user) {
        crearTramite({
          viajero: { nombre: user.nombre, rut: user.rut, email: user.email },
          tipo: 'sag',
          estado: traeProductos ? 'pendiente-inspeccion' : 'aprobado',
          pasoFronterizo: user.paso || 'Los Libertadores (Mendoza)',
          fechaViaje: 'Hoy',
          destino: 'Trámite Standalone',
          motivo: 'Declaración de Productos Regulados',
          acompanantes: [],
          menores: [],
          vehiculo: null,
          declaracionSAG: { traeProductos, descripcion, items: traeProductos ? ['inspeccion_requerida'] : [] },
          documentos: ['Declaración SAG pre-registrada ✓'],
          observaciones: traeProductos ? 'Inspección física obligatoria requerida al cruzar.' : '',
          prioridad: 'normal'
        });
      }
      setQrCodeData(`SAG-2026-${Math.floor(Math.random() * 90000) + 10000}`);
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="declaracion-sag">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
          <Leaf size={24} color="var(--color-success-text)" />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Declaración Jurada Conjunta (SAG)
          </h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              Todo viajero que ingrese al territorio nacional está obligado a declarar si porta productos químicos, semillas, plantas, partes de plantas, productos de origen animal o artesanías de madera.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="label">¿Transporta productos de origen animal o vegetal?</label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => setTraeProductos(true)}
                  className={`btn ${traeProductos === true ? 'btn--primary' : 'btn--outline'}`}
                  style={{ flex: 1 }}
                >
                  SÍ, transporto productos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTraeProductos(false);
                    setDescripcion('');
                  }}
                  className={`btn ${traeProductos === false ? 'btn--primary' : 'btn--outline'}`}
                  style={{ flex: 1 }}
                >
                  NO, no transporto nada
                </button>
              </div>
            </div>

            {traeProductos === true && (
              <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label className="label">Detalle los productos declarados:</label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Ej: Mermeladas caseras en frascos sellados, recuerdos de madera nativa..."
                  className="input"
                  rows={4}
                  required
                  style={{ resize: 'none' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={traeProductos === null || submitting}
              className="btn btn--primary btn--full"
              style={{ marginTop: 'var(--space-2)' }}
            >
              {submitting ? <div className="spinner" /> : 'Registrar Declaración SAG'}
            </button>
          </form>
        ) : (
          <div className="declaracion-sag__qr-card animate-fadeIn">
            {traeProductos ? (
              <div className="declaracion-sag__qr-code declaracion-sag__qr-code--alert">
                <QrCode size={120} color="var(--color-danger)" />
              </div>
            ) : (
              <div className="declaracion-sag__qr-code">
                <QrCode size={120} color="var(--color-success)" />
              </div>
            )}

            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {traeProductos ? 'Pre-Declaración Registrada (Alerta de Inspección)' : 'Declaración Aprobada (Paso Directo)'}
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', maxWidth: '24rem' }}>
              {traeProductos
                ? 'Debe presentar este código QR al inspector SAG en frontera para la revisión física de sus productos.'
                : 'Muestre este comprobante en los lectores electrónicos de la aduana para habilitar su paso directo.'}
            </p>
            <div style={{ marginTop: 'var(--space-4)', padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>
              Código: {qrCodeData}
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setTraeProductos(null);
                setDescripcion('');
                setQrCodeData(null);
              }}
              className="btn btn--outline"
              style={{ marginTop: 'var(--space-5)' }}
            >
              Nueva Declaración
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
