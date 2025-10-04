import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useLandingPointLocation } from "./LandingPointLocationContext";

// Estructura de los datos del punto de aterrizaje propuesto
type LocalData = {
  id: string; // para identificar borradores
  nombre: string;
  telefono: string;
  nombrePunto: string;
  localidad: string;
  latitud: string;
  longitud: string;
  descripcion: string;
  restricciones: string;
  soloDiurno: boolean;
  observaciones: string;
  fotos: string[];
};

const LOCAL_STORAGE_KEY = "review-form-borradores-puntos-v3";

function getEmptyData(): LocalData {
  return {
    id: crypto.randomUUID(),
    nombre: "",
    telefono: "",
    nombrePunto: "",
    localidad: "",
    latitud: "",
    longitud: "",
    descripcion: "",
    restricciones: "",
    soloDiurno: false,
    observaciones: "",
    fotos: [],
  };
}

function loadBorradores(): LocalData[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalData[];
  } catch {
    return [];
  }
}

function saveBorradores(borradores: LocalData[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(borradores));
}

export default function ReviewForm() {
  const [local, setLocal] = useState<LocalData>(getEmptyData());
  const [borradores, setBorradores] = useState<LocalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<null | "save" | "send" | "both">(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Simulación de usuario actual
  const currentUser = { email: "usuario@ejemplo.com" };

  // Cargar borradores de localStorage
  useEffect(() => {
    setBorradores(loadBorradores());
  }, []);

  // Controlar cambios del formulario
  const handleChange =
    (field: keyof Omit<LocalData, "fotos" | "id">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setLocal({ ...local, [field]: value });
    };

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const promises = fileArray.map(
        file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );
      Promise.all(promises)
        .then(fotosBase64 => {
          setLocal(prev => ({
            ...prev,
            fotos: [...prev.fotos, ...fotosBase64],
          }));
          toast({
            title: "Fotos añadidas",
            description: `Se han añadido ${fotosBase64.length} foto(s).`,
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Error con las fotos",
            description: "No se han podido cargar las fotos seleccionadas.",
          });
        });
    }
  };

  const handleFotoRemove = (idx: number) => {
    setLocal(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== idx),
    }));
  };

  // Actualiza los campos lat/lng si el usuario selecciona en el mapa
  const { lat, lng } = useLandingPointLocation();
  React.useEffect(() => {
    // Sólo actualiza si tenemos valores nuevos y distintos a los actuales
    if (
      lat &&
      lng &&
      (lat !== local.latitud || lng !== local.longitud)
    ) {
      setLocal((prev) => ({
        ...prev,
        latitud: lat,
        longitud: lng,
      }));
      toast({
        title: "Ubicación seleccionada en el mapa",
        description: `Lat: ${lat}, Lng: ${lng}`
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  // --------- Borradores gestion local ---------
  function guardarBorrador(data: LocalData) {
    // Evitar duplicado por (nombrePunto+localidad+lat+lng)
    const isDuplicate = borradores.some(
      b =>
        b.nombrePunto.trim().toLowerCase() === data.nombrePunto.trim().toLowerCase() &&
        b.localidad.trim().toLowerCase() === data.localidad.trim().toLowerCase() &&
        b.latitud === data.latitud &&
        b.longitud === data.longitud &&
        b.id !== data.id
    );
    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Ya existe un borrador igual",
        description: "No se puede guardar uno duplicado.",
      });
      return;
    }
    let nuevosBorradores: LocalData[];
    if (editId) {
      // Edición, reemplazar
      nuevosBorradores = borradores.map(b => b.id === editId ? { ...data } : b);
    } else {
      nuevosBorradores = [...borradores, { ...data }];
    }
    setBorradores(nuevosBorradores);
    saveBorradores(nuevosBorradores);
    toast({ title: "Borrador guardado localmente" });
    setEditId(null);
    setLocal(getEmptyData());
  }

  function eliminarBorrador(id: string) {
    const nuevos = borradores.filter(b => b.id !== id);
    setBorradores(nuevos);
    saveBorradores(nuevos);
    toast({ title: "Borrador eliminado" });
  }

  function editarBorrador(id: string) {
    const b = borradores.find(b => b.id === id);
    if (b) {
      setLocal({ ...b });
      setEditId(id);
      toast({ title: "Editando borrador" });
    }
  }

  // --------- Envio remoto ---------
  async function enviarPropuesta(data: LocalData, removeOnSuccess = false) {
    // Validar campos mínimos
    if (!data.nombrePunto || !data.localidad || !data.latitud || !data.longitud) {
      toast({
        variant: "destructive",
        title: "Faltan datos obligatorios",
        description: "Revisa los campos importantes.",
      });
      return;
    }

    setLoading(true);
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbx1gOPeFd59uKv6FQSG5hFYxzKNcHFs-Xxoiwvmd4ZdQBXogmpkxox3nq4zIVjSnoCBpA/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: currentUser.email,
            datos: {
              nombre: data.nombre,
              telefono: data.telefono,
              puntoDeAterrizaje: {
                nombre: data.nombrePunto,
                localidad: data.localidad,
                latitud: data.latitud,
                longitud: data.longitud,
                descripcion: data.descripcion,
                restricciones: data.restricciones,
                soloDiurno: data.soloDiurno,
                observaciones: data.observaciones,
                fotos: data.fotos,
              },
            },
          }),
        }
      );
      toast({
        title: "Propuesta enviada",
        description: "Tu propuesta ha sido enviada para revisión.",
      });
      // Eliminar borrador si toca
      if (removeOnSuccess) {
        eliminarBorrador(data.id);
      }
      // Si no es edición, limpiar formulario
      setLocal(getEmptyData());
      setEditId(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la propuesta.",
      });
    } finally {
      setLoading(false);
    }
  }

  // --------- Acción principal ---------
  const handleMainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModal("save"); // Modal de elegir qué hacer: guardar, enviar, ambas
  };

  function ModalEleccion() {
    if (!modal) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
        <div className="bg-white p-4 rounded-xl shadow-lg max-w-xs w-full text-center">
          <h3 className="font-bold mb-2">¿Qué deseas hacer?</h3>
          <p className="text-sm mb-4">Puedes guardar el formulario como borrador en tu dispositivo, enviarlo para revisión o ambas opciones.</p>
          <div className="flex flex-col gap-2">
            <Button
              disabled={loading}
              onClick={() => {
                guardarBorrador(local);
                setModal(null);
              }}
            >
              Guardar sólo en mi dispositivo
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                await enviarPropuesta(local, false);
                setModal(null);
              }}
            >
              Enviar sólo para revisión
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                guardarBorrador(local);
                await enviarPropuesta(local, true);
                setModal(null);
              }}
            >
              Guardar y enviar ambas cosas
            </Button>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Listado de Borradores guardados -----
  function ListaBorradores() {
    if (borradores.length === 0) {
      return <div className="text-sm text-muted-foreground">No hay borradores guardados</div>;
    }
    return (
      <div className="space-y-2">
        {borradores.map(b => (
          <div
            key={b.id}
            className="border rounded p-2 flex flex-col gap-1 bg-gray-50 relative"
          >
            <div><span className="font-semibold">{b.nombrePunto}</span> – <span className="text-xs">{b.localidad}</span></div>
            <div className="text-xs text-muted-foreground">Lat/Lng: {b.latitud}, {b.longitud}</div>
            <div className="flex gap-2 mt-1">
              <Button size="sm" onClick={() => editarBorrador(b.id)}>Editar</Button>
              <Button size="sm" variant="outline" onClick={() => enviarPropuesta(b, true)}>Enviar y eliminar</Button>
              <Button size="sm" variant="destructive" onClick={() => eliminarBorrador(b.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ---- Render ----
  return (
    <div className="mx-auto max-w-md space-y-6 py-4">
      <ModalEleccion />
      <div className="border rounded-lg shadow-md bg-white p-4">
        <h2 className="text-lg font-bold text-center mb-3">Proponer nuevo punto de aterrizaje</h2>
        <form className="space-y-4" onSubmit={handleMainSubmit}>
          <div>
            <label className="block mb-1 font-bold">Tu nombre</label>
            <Input
              type="text"
              value={local.nombre}
              onChange={handleChange("nombre")}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">Tu teléfono</label>
            <Input
              type="tel"
              value={local.telefono}
              onChange={handleChange("telefono")}
            />
          </div>
          <hr />
          <div>
            <label className="block mb-1 font-bold">Nombre del punto de aterrizaje</label>
            <Input
              type="text"
              value={local.nombrePunto}
              onChange={handleChange("nombrePunto")}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">Localidad</label>
            <Input
              type="text"
              value={local.localidad}
              onChange={handleChange("localidad")}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-bold">Latitud</label>
              <Input
                type="number"
                step="any"
                value={local.latitud}
                onChange={handleChange("latitud")}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">Longitud</label>
              <Input
                type="number"
                step="any"
                value={local.longitud}
                onChange={handleChange("longitud")}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-bold">Descripción</label>
            <Textarea
              value={local.descripcion}
              onChange={handleChange("descripcion")}
              rows={2}
              placeholder="Ej: Terreno llano, acceso sencillo, cerca del centro de salud..."
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">Restricciones</label>
            <Input
              type="text"
              value={local.restricciones}
              onChange={handleChange("restricciones")}
              placeholder="Ej: Uso diurno, pendiente leve..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              className="form-checkbox"
              type="checkbox"
              checked={local.soloDiurno}
              onChange={handleChange("soloDiurno")}
              id="soloDiurno"
            />
            <label htmlFor="soloDiurno" className="font-semibold select-none cursor-pointer">
              Solo para uso diurno
            </label>
          </div>
          <div>
            <label className="block mb-1 font-bold">Observaciones</label>
            <Textarea
              value={local.observaciones}
              onChange={handleChange("observaciones")}
              rows={2}
            />
          </div>
          <div>
            <label className="block mb-1 font-bold">
              Fotos de referencia
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotosChange}
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {local.fotos.map((foto, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={foto}
                    alt={`foto ${idx + 1}`}
                    className="rounded object-cover h-24 w-full border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full px-1 text-xs shadow border"
                    onClick={() => handleFotoRemove(idx)}
                    title="Eliminar foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Procesando..." : editId ? "Actualizar propuesta" : "Siguiente"}
          </Button>
        </form>
      </div>
      {/* Listado de borradores */}
      <div className="border rounded-lg bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-base mb-2">Tus borradores guardados</h3>
        <ListaBorradores />
      </div>
    </div>
  );
}
