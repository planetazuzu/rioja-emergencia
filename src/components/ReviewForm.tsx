
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type LocalData = {
  nombre: string;
  telefono: string;
  observaciones: string;
};

const LOCAL_STORAGE_KEY = "review-form-data";

function saveLocalData(data: LocalData) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function loadLocalData(): LocalData {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return { nombre: "", telefono: "", observaciones: "" };
  try {
    return JSON.parse(raw);
  } catch {
    return { nombre: "", telefono: "", observaciones: "" };
  }
}

export default function ReviewForm() {
  const [local, setLocal] = useState<LocalData>(loadLocalData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveLocalData(local);
  }, [local]);

  // Simulación de usuario actual, reemplaza con hook de autenticación real si existe.
  const currentUser = { email: "usuario@ejemplo.com" };

  const handleChange =
    (field: keyof LocalData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLocal({ ...local, [field]: e.target.value });
    };

  const handleSubmit = async () => {
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
              observaciones: local.observaciones,
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
      <div>
        <label className="block mb-1 font-bold">Nombre</label>
        <Input
          type="text"
          value={local.nombre}
          onChange={handleChange("nombre")}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-bold">Teléfono</label>
        <Input
          type="tel"
          value={local.telefono}
          onChange={handleChange("telefono")}
        />
      </div>
      <div>
        <label className="block mb-1 font-bold">Observaciones</label>
        <Textarea
          value={local.observaciones}
          onChange={handleChange("observaciones")}
          rows={3}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Enviar para revisión"}
      </Button>
    </form>
  );
}
