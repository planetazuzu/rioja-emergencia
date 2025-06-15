
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
};

const LOCAL_STORAGE_KEY = "review-form-data-propuesta-punto";

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
    (field: keyof LocalData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setLocal({ ...local, [field]: value });
    };

  const handleSubmit = async () => {
    // Validaciones simples para campos requeridos
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
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Enviar para revisión"}
      </Button>
    </form>
  );
}
