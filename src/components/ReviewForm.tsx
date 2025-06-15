
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Estructura de los datos del punto de aterrizaje propuesto
type LocalData = {
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

const LOCAL_STORAGE_KEY = "review-form-data-propuesta-punto-v2";

function saveLocalData(data: LocalData) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function loadLocalData(): LocalData {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return {
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
  try {
    return JSON.parse(raw);
  } catch {
    return {
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
}

export default function ReviewForm() {
  const [local, setLocal] = useState<LocalData>(loadLocalData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveLocalData(local);
  }, [local]);

  // Simulación de usuario actual
  const currentUser = { email: "usuario@ejemplo.com" };

  const handleChange =
    (field: keyof Omit<LocalData, "fotos">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = async () => {
    if (
      !local.nombrePunto ||
      !local.localidad ||
      !local.latitud ||
      !local.longitud
    ) {
      toast({
        variant: "destructive",
        title: "Faltan datos",
        description: "Por favor, completa los campos obligatorios del punto de aterrizaje.",
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
              nombre: local.nombre,
              telefono: local.telefono,
              puntoDeAterrizaje: {
                nombre: local.nombrePunto,
                localidad: local.localidad,
                latitud: local.latitud,
                longitud: local.longitud,
                descripcion: local.descripcion,
                restricciones: local.restricciones,
                soloDiurno: local.soloDiurno,
                observaciones: local.observaciones,
                fotos: local.fotos,
              },
            },
          }),
        }
      );
      toast({
        title: "Enviado para revisión",
        description: "Tu propuesta ha sido enviada para revisión. Gracias.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mx-auto max-w-md space-y-4 p-4 border rounded-lg shadow-md bg-white"
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className="text-lg font-bold text-center mb-3">Proponer nuevo punto de aterrizaje</h2>
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
        {loading ? "Enviando..." : "Enviar para revisión"}
      </Button>
    </form>
  );
}
