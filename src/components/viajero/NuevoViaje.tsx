import { useState } from 'react';
import { useTramites } from '../../context/TramitesContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronRight, ChevronLeft, Plus, Trash2, Upload, FileText, Check, AlertCircle, Plane
} from 'lucide-react';
import { PASOS_FRONTERIZOS } from '../../types';

interface NuevoViajeProps {
  onNavigate: (page: string) => void;
}

export function NuevoViaje({ onNavigate }: NuevoViajeProps) {
  const { crearTramite } = useTramites();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Paso 1: Datos de Viaje
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [paso, setPaso] = useState(PASOS_FRONTERIZOS[0]);
  const [fechaViaje, setFechaViaje] = useState('');
  const [motivo, setMotivo] = useState('Turismo');
  const [conMenores, setConMenores] = useState(false);
  const [conVehiculo, setConVehiculo] = useState(false);

  // Paso 2: Grupo Familiar
  const [acompanantes, setAcompanantes] = useState<{ nombre: string; rut: string; parentesco: string }[]>([]);
  const [nuevoAcomp, setNuevoAcomp] = useState({ nombre: '', rut: '', parentesco: 'Cónyuge' });

  const [menores, setMenores] = useState<{ nombre: string; rut: string; edad: number; relacion: string; docAdjunto: boolean; nombreDoc: string }[]>([]);
  const [nuevoMenor, setNuevoMenor] = useState({ nombre: '', rut: '', edad: 10, relacion: 'Hijo', docAdjunto: false, nombreDoc: '' });

  // Paso 3: Declaración SAG
  const [traeProductos, setTraeProductos] = useState<boolean | null>(null);
  const [descProductos, setDescProductos] = useState('');

  // Paso 4: Vehículo
  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [color, setColor] = useState('');
  const [propietario, setPropietario] = useState('');
  const [rutPropietario, setRutPropietario] = useState('');
  const [operacion, setOperacion] = useState<'salida' | 'ingreso'>('salida');
  const [padronAdjunto, setPadronAdjunto] = useState(false);
  const [nombrePadron, setNombrePadron] = useState('');

  // Auxiliares para agregar acompañantes
  const handleAddAcompanante = () => {
    if (!nuevoAcomp.nombre || !nuevoAcomp.rut) {
      setError('Complete el nombre y RUN del acompañante');
      return;
    }
    setAcompanantes([...acompanantes, nuevoAcomp]);
    setNuevoAcomp({ nombre: '', rut: '', parentesco: 'Cónyuge' });
    setError('');
  };

  const handleAddMenor = () => {
    if (!nuevoMenor.nombre || !nuevoMenor.rut) {
      setError('Complete el nombre y RUN del menor');
      return;
    }
    setMenores([...menores, nuevoMenor]);
    setNuevoMenor({ nombre: '', rut: '', edad: 10, relacion: 'Hijo', docAdjunto: false, nombreDoc: '' });
    setError('');
  };

  const handleRemoveAcompanante = (idx: number) => {
    setAcompanantes(acompanantes.filter((_, i) => i !== idx));
  };

  const handleRemoveMenor = (idx: number) => {
    setMenores(menores.filter((_, i) => i !== idx));
  };

  const simulateDocUpload = (idx: number) => {
    setMenores(menores.map((m, i) => {
      if (i !== idx) return m;
      return { ...m, docAdjunto: true, nombreDoc: `autorizacion_${m.nombre.replace(/\s+/g, '_').toLowerCase()}.pdf` };
    }));
  };

  const simulatePadronUpload = () => {
    setPadronAdjunto(true);
    setNombrePadron(`padron_${patente ? patente.toLowerCase() : 'vehiculo'}.pdf`);
  };

  // Validaciones por paso
  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!origen || !destino || !fechaViaje) {
        setError('Por favor complete todos los campos obligatorios del viaje.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (conMenores && menores.length === 0) {
        setError('Ha marcado que viaja con menores de edad. Por favor agregue al menos un menor.');
        return;
      }
      // CRITICAL VALIDATION: Si hay menores y alguno no tiene el documento notarial adjunto
      if (conMenores) {
        const sinDoc = menores.find(m => !m.docAdjunto);
        if (sinDoc) {
          setError(`Falta adjuntar la autorización notarial para el menor: ${sinDoc.nombre}. El envío está bloqueado.`);
          return;
        }
      }
      setStep(3);
    } else if (step === 3) {
      if (traeProductos === null) {
        setError('Debe declarar si trae o no productos regulados por el SAG.');
        return;
      }
      if (traeProductos && !descProductos.trim()) {
        setError('Por favor detalle los productos de origen vegetal/animal que transporta.');
        return;
      }
      if (conVehiculo) {
        setStep(4);
      } else {
        setStep(5);
      }
    } else if (step === 4) {
      if (!patente || !marca || !modelo || !anio || !propietario || !rutPropietario) {
        setError('Complete todos los datos de identificación del vehículo.');
        return;
      }
      if (!padronAdjunto) {
        setError('Es obligatorio adjuntar el padrón del vehículo.');
        return;
      }
      setStep(5);
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 5) {
      if (conVehiculo) {
        setStep(4);
      } else {
        setStep(3);
      }
    } else {
      setStep(step - 1);
    }
  };

  // Envío final
  const handleSubmit = () => {
    if (!user) return;

    // Crear lista de documentos
    const docs = ['Cédula de identidad ✓'];
    if (conMenores) {
      menores.forEach(m => docs.push(`Aut. Notarial menor ${m.nombre} ✓`));
    }
    if (conVehiculo) {
      docs.push(`Padrón Vehículo (${patente}) ✓`);
    }
    if (traeProductos) {
      docs.push('Declaración SAG (Verificada en portal) ✓');
    }

    const nuevoTramite = crearTramite({
      viajero: {
        nombre: user.nombre,
        rut: user.rut,
        email: user.email
      },
      tipo: 'viaje',
      estado: 'pendiente',
      pasoFronterizo: paso,
      fechaViaje,
      destino: `${destino} (desde ${origen})`,
      motivo,
      acompanantes,
      menores: menores.map(m => ({
        nombre: m.nombre,
        rut: m.rut,
        edad: m.edad,
        relacion: m.relacion,
        docAdjunto: m.docAdjunto
      })),
      vehiculo: conVehiculo ? {
        patente, marca, modelo, anio, color, propietario, rutPropietario, operacion,
        tipo: 'Particular'
      } : null,
      declaracionSAG: traeProductos !== null ? {
        traeProductos,
        descripcion: descProductos,
        items: traeProductos ? ['inspeccion_requerida'] : []
      } : null,
      documentos: docs,
      observaciones: '',
      prioridad: 'normal'
    });

    onNavigate('seguimiento');
  };

  return (
    <div className="nuevo-viaje">
      <div className="nuevo-viaje__card">
        {/* Stepper Header */}
        <div className="stepper">
          <div className={`stepper__item ${step === 1 ? 'stepper__item--active' : step > 1 ? 'stepper__item--completed' : ''}`}>
            <span className="stepper__circle">{step > 1 ? '✓' : '1'}</span>
            <span>Viaje</span>
          </div>
          <div className={`stepper__item ${step === 2 ? 'stepper__item--active' : step > 2 ? 'stepper__item--completed' : ''}`}>
            <span className="stepper__circle">{step > 2 ? '✓' : '2'}</span>
            <span>Acompañantes</span>
          </div>
          <div className={`stepper__item ${step === 3 ? 'stepper__item--active' : step > 3 ? 'stepper__item--completed' : ''}`}>
            <span className="stepper__circle">{step > 3 ? '✓' : '3'}</span>
            <span>SAG</span>
          </div>
          {conVehiculo && (
            <div className={`stepper__item ${step === 4 ? 'stepper__item--active' : step > 4 ? 'stepper__item--completed' : ''}`}>
              <span className="stepper__circle">{step > 4 ? '✓' : '4'}</span>
              <span>Vehículo</span>
            </div>
          )}
          <div className={`stepper__item ${step === 5 ? 'stepper__item--active' : ''}`}>
            <span className="stepper__circle">5</span>
            <span>Confirmar</span>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ minHeight: '320px' }}>
          {error && (
            <div style={{ margin: 'var(--space-4) var(--space-6) 0 var(--space-6)' }} className="form-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* PASO 1 */}
          {step === 1 && (
            <div className="form-step">
              <h2 className="form-step__title">Datos del Viaje Terrestre</h2>
              <div className="form-grid">
                <div>
                  <label className="label">Origen (Ciudad/Comuna)</label>
                  <input
                    type="text"
                    value={origen}
                    onChange={e => setOrigen(e.target.value)}
                    placeholder="Ej: Santiago"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Destino (Ciudad/País)</label>
                  <input
                    type="text"
                    value={destino}
                    onChange={e => setDestino(e.target.value)}
                    placeholder="Ej: Mendoza, Argentina"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Paso Fronterizo</label>
                  <select value={paso} onChange={e => setPaso(e.target.value)} className="input">
                    {PASOS_FRONTERIZOS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Fecha del Viaje</label>
                  <input
                    type="date"
                    value={fechaViaje}
                    onChange={e => setFechaViaje(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-grid--full">
                  <label className="label">Motivo del Viaje</label>
                  <input
                    type="text"
                    value={motivo}
                    onChange={e => setMotivo(e.target.value)}
                    placeholder="Ej: Turismo, Compras, Trabajo"
                    className="input"
                  />
                </div>

                <div className="form-grid--full" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                  <label className={`checkbox-card ${conMenores ? 'checkbox-card--checked' : ''}`} style={{ flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={conMenores}
                      onChange={e => setConMenores(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>Viajo con menores de edad</strong>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        Habilita la carga de autorizaciones notariales.
                      </span>
                    </div>
                  </label>

                  <label className={`checkbox-card ${conVehiculo ? 'checkbox-card--checked' : ''}`} style={{ flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={conVehiculo}
                      onChange={e => setConVehiculo(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>Viajo en vehículo particular</strong>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        Habilita el registro de patente y carga de padrón.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="form-step">
              <h2 className="form-step__title">Grupo Familiar y Menores</h2>

              {/* Acompañantes generales */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Acompañantes Adultos</h4>
                <div className="form-grid" style={{ alignItems: 'end', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <label className="label">Nombre completo</label>
                    <input
                      type="text"
                      value={nuevoAcomp.nombre}
                      onChange={e => setNuevoAcomp({ ...nuevoAcomp, nombre: e.target.value })}
                      placeholder="Nombre"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">RUN / Pasaporte</label>
                    <input
                      type="text"
                      value={nuevoAcomp.rut}
                      onChange={e => setNuevoAcomp({ ...nuevoAcomp, rut: e.target.value })}
                      placeholder="RUN"
                      className="input"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <div style={{ flex: 1 }}>
                      <label className="label">Parentesco</label>
                      <select
                        value={nuevoAcomp.parentesco}
                        onChange={e => setNuevoAcomp({ ...nuevoAcomp, parentesco: e.target.value })}
                        className="input"
                      >
                        <option>Cónyuge</option>
                        <option>Hermano/a</option>
                        <option>Padre/Madre</option>
                        <option>Amigo/a</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <button type="button" onClick={handleAddAcompanante} className="btn btn--outline" style={{ padding: '0 var(--space-4)', height: '38px' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {acompanantes.length > 0 && (
                  <table className="group-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>RUN</th>
                        <th>Parentesco</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {acompanantes.map((a, i) => (
                        <tr key={i}>
                          <td>{a.nombre}</td>
                          <td>{a.rut}</td>
                          <td>{a.parentesco}</td>
                          <td>
                            <button type="button" onClick={() => handleRemoveAcompanante(i)} style={{ color: 'var(--color-danger)' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Menores de edad */}
              {conMenores && (
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-primary-light)' }}>
                    Menores de Edad (Requisito Control de Salida)
                  </h4>
                  <div className="form-grid" style={{ alignItems: 'end', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <label className="label">Nombre del menor</label>
                      <input
                        type="text"
                        value={nuevoMenor.nombre}
                        onChange={e => setNuevoMenor({ ...nuevoMenor, nombre: e.target.value })}
                        placeholder="Nombre"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">RUN / Pasaporte</label>
                      <input
                        type="text"
                        value={nuevoMenor.rut}
                        onChange={e => setNuevoMenor({ ...nuevoMenor, rut: e.target.value })}
                        placeholder="RUN"
                        className="input"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <div style={{ width: '60px' }}>
                        <label className="label">Edad</label>
                        <input
                          type="number"
                          value={nuevoMenor.edad}
                          onChange={e => setNuevoMenor({ ...nuevoMenor, edad: parseInt(e.target.value) || 0 })}
                          className="input"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="label">Relación</label>
                        <select
                          value={nuevoMenor.relacion}
                          onChange={e => setNuevoMenor({ ...nuevoMenor, relacion: e.target.value })}
                          className="input"
                        >
                          <option>Hijo/a</option>
                          <option>Sobrino/a</option>
                          <option>Nieto/a</option>
                          <option>Tutelado/a</option>
                        </select>
                      </div>
                      <button type="button" onClick={handleAddMenor} className="btn btn--outline" style={{ padding: '0 var(--space-4)', height: '38px' }}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {menores.length > 0 && (
                    <table className="group-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>RUN</th>
                          <th>Edad</th>
                          <th>Relación</th>
                          <th>Autorización Notarial</th>
                          <th style={{ width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {menores.map((m, i) => (
                          <tr key={i}>
                            <td>{m.nombre}</td>
                            <td>{m.rut}</td>
                            <td>{m.edad} años</td>
                            <td>{m.relacion}</td>
                            <td>
                              {m.docAdjunto ? (
                                <span style={{ color: 'var(--color-success-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Check size={12} /> {m.nombreDoc}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => simulateDocUpload(i)}
                                  className="btn btn--primary"
                                  style={{ padding: '2px 8px', fontSize: '10px', borderRadius: '4px' }}
                                >
                                  <Upload size={10} /> Adjuntar PDF
                                </button>
                              )}
                            </td>
                            <td>
                              <button type="button" onClick={() => handleRemoveMenor(i)} style={{ color: 'var(--color-danger)' }}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div className="form-step">
              <h2 className="form-step__title">Declaración SAG (Fitosanitaria)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  ¿Trae consigo productos de origen vegetal, frutas, semillas, productos animales (quesos, cecinas sin sellar) o artesanías de madera?
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <button
                    type="button"
                    onClick={() => setTraeProductos(true)}
                    className={`btn ${traeProductos === true ? 'btn--primary' : 'btn--outline'}`}
                    style={{ flex: 1 }}
                  >
                    SÍ, traigo productos regulados
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTraeProductos(false);
                      setDescProductos('');
                    }}
                    className={`btn ${traeProductos === false ? 'btn--primary' : 'btn--outline'}`}
                    style={{ flex: 1 }}
                  >
                    NO, no traigo ningún producto regulado
                  </button>
                </div>

                {traeProductos === true && (
                  <div className="animate-fadeIn">
                    <label className="label">Describa detalladamente los productos (Cantidad, tipo y origen):</label>
                    <textarea
                      value={descProductos}
                      onChange={e => setDescProductos(e.target.value)}
                      placeholder="Ej: 3 Manzanas de mercado chileno, 1 tabla de picar de madera de pino..."
                      className="input"
                      rows={4}
                      style={{ resize: 'none' }}
                    />
                    <div className="alert alert--warning" style={{ marginTop: 'var(--space-3)' }}>
                      <AlertCircle size={16} />
                      <span>
                        <strong>Aviso SAG:</strong> Declarar productos regulados requiere inspección física en frontera.
                        El envío de esta declaración no constituye una multa, sino un proceso reglamentario de resguardo fitosanitario.
                      </span>
                    </div>
                  </div>
                )}

                {traeProductos === false && (
                  <div className="alert alert--success animate-fadeIn">
                    <Check size={16} />
                    <span>Ha declarado que NO transporta productos regulados. Su pre-aprobación del SAG se procesará automáticamente.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {step === 4 && conVehiculo && (
            <div className="form-step">
              <h2 className="form-step__title">Registro de Vehículo Particular</h2>
              <div className="form-grid">
                <div>
                  <label className="label">Patente (Patente Única Nacional)</label>
                  <input
                    type="text"
                    value={patente}
                    onChange={e => setPatente(e.target.value)}
                    placeholder="Ej: ABCD-12"
                    className="input"
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
                    placeholder="Toyota, Hyundai..."
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Modelo</label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={e => setModelo(e.target.value)}
                    placeholder="Hilux, Santa Fe..."
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Año</label>
                  <input
                    type="text"
                    value={anio}
                    onChange={e => setAnio(e.target.value)}
                    placeholder="2022"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    placeholder="Gris, Blanco..."
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Propietario del Vehículo</label>
                  <input
                    type="text"
                    value={propietario}
                    onChange={e => setPropietario(e.target.value)}
                    placeholder="Nombre completo"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">RUN Propietario</label>
                  <input
                    type="text"
                    value={rutPropietario}
                    onChange={e => setRutPropietario(e.target.value)}
                    placeholder="Ej: 12.345.678-9"
                    className="input"
                  />
                </div>

                <div className="form-grid--full">
                  <label className="label">Padrón Vehicular / Título de propiedad</label>
                  {padronAdjunto ? (
                    <div className="alert alert--success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> {nombrePadron}
                      </span>
                      <button type="button" onClick={() => setPadronAdjunto(false)} style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '11px' }}>
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div className="file-upload" onClick={simulatePadronUpload}>
                      <Upload size={24} className="file-upload__icon" />
                      <div className="file-upload__label">Presione aquí para cargar el Padrón Vehicular (PDF/JPG)</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Obligatorio para la validación aduanera</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 5 */}
          {step === 5 && (
            <div className="form-step">
              <h2 className="form-step__title">Resumen y Confirmación de Trámite</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Datos de Viaje</h4>
                  <p style={{ fontSize: 'var(--text-xs)' }}><strong>Paso Fronterizo:</strong> {paso}</p>
                  <p style={{ fontSize: 'var(--text-xs)' }}><strong>Fecha:</strong> {fechaViaje}</p>
                  <p style={{ fontSize: 'var(--text-xs)' }}><strong>Ruta:</strong> de {origen} a {destino}</p>
                  <p style={{ fontSize: 'var(--text-xs)' }}><strong>Motivo:</strong> {motivo}</p>
                </div>

                {acompanantes.length > 0 && (
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Acompañantes ({acompanantes.length})</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
                      {acompanantes.map((a, i) => (
                        <li key={i}>{a.nombre} ({a.rut}) - {a.parentesco}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {conMenores && menores.length > 0 && (
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Menores de edad ({menores.length})</h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
                      {menores.map((m, i) => (
                        <li key={i}>
                          {m.nombre} ({m.rut}) - {m.edad} años - Relación: {m.relacion}
                          <span style={{ color: 'var(--color-success-text)', marginLeft: '6px', fontWeight: 500 }}>
                            ✓ Autorización Notarial Cargada ({m.nombreDoc})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Declaración Fitosanitaria SAG</h4>
                  {traeProductos ? (
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning-text)' }}>⚠️ Declaración con productos regulados</p>
                      <p style={{ fontSize: 'var(--text-xs)', background: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', padding: '6px', borderRadius: '4px', marginTop: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        {descProductos}
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-text)' }}>✓ Declaró no transportar productos regulados</p>
                  )}
                </div>

                {conVehiculo && (
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Vehículo de Transporte</h4>
                    <p style={{ fontSize: 'var(--text-xs)' }}><strong>Patente:</strong> {patente}</p>
                    <p style={{ fontSize: 'var(--text-xs)' }}><strong>Marca/Modelo/Año:</strong> {marca} {modelo} ({anio}) - {color}</p>
                    <p style={{ fontSize: 'var(--text-xs)' }}><strong>Propietario:</strong> {propietario} ({rutPropietario})</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-text)' }}>✓ Padrón vehicular adjunto: {nombrePadron}</p>
                  </div>
                )}

                <div className="alert alert--info">
                  <Check size={16} />
                  <span>Al enviar este formulario, usted autoriza el procesamiento e intercambio legal de su información entre Aduanas, PDI y SAG.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Footer Buttons */}
        <div className="form-footer">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn btn--outline">
              <ChevronLeft size={16} /> Atrás
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button type="button" onClick={handleNext} className="btn btn--primary">
              Siguiente <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn--success">
              Confirmar e Iniciar Trámite <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
