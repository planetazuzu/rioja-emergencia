
import { EvacuationPoint } from '../types/emergency';

export type EvacPointWithContact = Omit<EvacuationPoint, 'id'> & { email?: string; phone?: string };

export async function submitProposal(datos: EvacPointWithContact): Promise<void> {
  const currentUser = { email: datos.email || "usuario@ejemplo.com" };
  await fetch(
    "https://script.google.com/macros/s/AKfycbx1gOPeFd59uKv6FQSG5hFYxzKNcHFs-Xxoiwvmd4ZdQBXogmpkxox3nq4zIVjSnoCBpA/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: currentUser.email,
        telefono: datos.phone || "",
        datos: {
          nombre: datos.createdBy,
          telefono: datos.phone || "",
          puntoDeAterrizaje: {
            nombre: datos.name,
            localidad: datos.locality,
            latitud: datos.lat,
            longitud: datos.lng,
            descripcion: datos.description,
            restricciones: datos.restrictions || '',
            soloDiurno: datos.isDaytimeOnly,
            observaciones: "",
            fotos: datos.photos ?? [],
          },
        },
      }),
    }
  );
}
