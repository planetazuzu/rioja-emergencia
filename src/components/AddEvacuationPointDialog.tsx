import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EvacuationPoint } from '../types/emergency';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { Locate } from "lucide-react";

// ---- Tipado para el borrador local (id, creadoPor extendido, etc)
type LocalEvacPoint = Omit<EvacuationPoint, 'id' | 'status' | 'restrictions'> & {
  id: string;
  status?: string;
  restrictions?: string;
};

const LOCAL_STORAGE_KEY = "evacuation-point-borradores-v2";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  locality: z.string().min(1, "La localidad es obligatoria."),
  description: z.string().optional(),
  lat: z.coerce.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
  lng: z.coerce.number().min(-180, "Longitud inválida").max(180, "Longitud inválida"),
  createdBy: z.string().min(1, "El autor es obligatorio."),
  isDaytimeOnly: z.boolean().default(false),
});

interface AddEvacuationPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pointData: Omit<EvacuationPoint, 'id'>) => void;
}

export const AddEvacuationPointDialog: React.FC<AddEvacuationPointDialogProps> = ({ open, onOpenChange, onSave }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [borradores, setBorradores] = useState<LocalEvacPoint[]>([]);
  const [actionModal, setActionModal] = useState(false);
  const [pendingData, setPendingData] = useState<Omit<EvacuationPoint, 'id'> | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      locality: '',
      description: '',
      lat: 0,
      lng: 0,
      createdBy: '',
      isDaytimeOnly: false,
    },
  });

  // --- Cargar borradores de localStorage al abrir modal sólo la primera vez
  React.useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) setBorradores(JSON.parse(raw));
      } catch { /* vacío */ }
    }
  }, [open]);

  // --- Guardar borradores en localStorage
  function saveBorradores(newBorradores: LocalEvacPoint[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBorradores));
    setBorradores(newBorradores);
  }

  function guardarBorrador(data: Omit<EvacuationPoint, 'id'>) {
    const newDraft: LocalEvacPoint = {
      ...data,
      id: crypto.randomUUID(),
      status: 'available',
      restrictions: data.restrictions || 'Ninguna',
    };
    const nuevos = [...borradores, newDraft];
    saveBorradores(nuevos);
    toast({
      title: "Borrador guardado en tu dispositivo",
      description: "Puedes consultarlo y editarlo desde este navegador."
    });
  }
  function eliminarBorrador(id: string) {
    const nuevos = borradores.filter(b => b.id !== id);
    saveBorradores(nuevos);
    toast({ title: "Borrador eliminado" });
  }

  // --- Envío remoto
  async function enviarPropuesta(datos: Omit<EvacuationPoint, 'id'>, quitarLocalId?: string) {
    setLoading(true);
    try {
      // Simula usuario
      const currentUser = { email: "usuario@ejemplo.com" };
      await fetch(
        "https://script.google.com/macros/s/AKfycbx1gOPeFd59uKv6FQSG5hFYxzKNcHFs-Xxoiwvmd4ZdQBXogmpkxox3nq4zIVjSnoCBpA/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: currentUser.email,
            datos: {
              nombre: datos.createdBy,
              telefono: "",
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
      toast({
        title: "Propuesta enviada",
        description: "Tu propuesta ha sido enviada para revisión.",
      });
      if (quitarLocalId) {
        eliminarBorrador(quitarLocalId);
      }
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPhotos: string[] = [];
      let count = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          count++;
          if (count === files.length) {
            setPhotos(prev => [...prev, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // --- NUEVA función para ubicar al usuario
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocalización no soportada",
        description: "Tu navegador no admite la geolocalización."
      });
      return;
    }
    toast({ title: "Buscando tu ubicación..." });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        form.setValue("lat", latitude);
        form.setValue("lng", longitude);
        toast({
          title: "Ubicación detectada",
          description: `Latitud: ${latitude.toFixed(5)}, Longitud: ${longitude.toFixed(5)}`
        });
      },
      (err) => {
        toast({
          variant: "destructive",
          title: "No se pudo obtener la ubicación",
          description: err.message || "Verifica permisos y conexión."
        });
      }
    );
  };

  // --- Cuando el usuario pulse "Guardar Punto", mostrar elección modal
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const pointData: Omit<EvacuationPoint, 'id'> = {
      name: values.name,
      locality: values.locality,
      lat: values.lat,
      lng: values.lng,
      description: values.description || '',
      createdBy: values.createdBy,
      isDaytimeOnly: values.isDaytimeOnly,
      status: 'available',
      restrictions: 'Ninguna',
      photos: photos,
    };
    setPendingData(pointData); // Almacena los datos para la siguiente acción
    setActionModal(true); // Muestra el modal de elección
  };

  // --- Después de completar acción, limpiar todo
  const resetAll = () => {
    form.reset();
    setPhotos([]);
    setPendingData(null);
    setActionModal(false);
    onOpenChange(false);
  };

  // --- Modal de elección de acción: guardar, enviar, ambas
  function ActionChoiceModal() {
    if (!actionModal || !pendingData) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30">
        <div className="bg-white p-4 rounded-xl shadow-lg max-w-xs w-full text-center">
          <h3 className="font-bold mb-2">¿Qué deseas hacer?</h3>
          <p className="text-sm mb-4">Puedes guardar el formulario en tu dispositivo, compartirlo para revisión o ambas cosas.</p>
          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              disabled={loading}
              onClick={() => { guardarBorrador(pendingData); resetAll(); }}
            >
              Guardar sólo en mi dispositivo
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                await enviarPropuesta(pendingData);
                resetAll();
              }}
            >
              Compartir sólo para revisión
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                guardarBorrador(pendingData);
                await enviarPropuesta(pendingData);
                resetAll();
              }}
            >
              Guardar y compartir ambas cosas
            </Button>
            <Button variant="outline" onClick={resetAll}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    form.reset();
    setPhotos([]);
    setPendingData(null);
    setActionModal(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir/Proponer Punto de Aterrizaje</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo punto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
              <div className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input placeholder="Ej: Campo de fútbol de Arnedo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="locality" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad</FormLabel>
                    <FormControl><Input placeholder="Ej: Arnedo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4 items-end">
                  <FormField control={form.control} name="lat" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitud</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="42.2245" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <div className="flex flex-row gap-2 items-end">
                    <FormField control={form.control} name="lng" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Longitud</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="-2.1018" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    {/* Botón para obtener ubicación */}
                    <button
                      type="button"
                      aria-label="Obtener mi ubicación"
                      className="h-10 w-10 bg-secondary flex items-center justify-center rounded-md border ml-1 hover:bg-accent transition-colors"
                      onClick={handleLocateMe}
                      title="Ubicarme automáticamente"
                    >
                      <Locate className="text-primary" />
                    </button>
                  </div>
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl><Textarea placeholder="Terreno llano, con acceso por carretera..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="createdBy" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creado por</FormLabel>
                    <FormControl><Input placeholder="Nombre del agente" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormItem>
                  <FormLabel>Fotos de referencia</FormLabel>
                  <FormControl>
                    <Input type="file" multiple accept="image/*" onChange={handlePhotoUpload} />
                  </FormControl>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`preview ${index}`} className="rounded-md object-cover h-24 w-full" />
                    ))}
                  </div>
                </FormItem>
                <FormField control={form.control} name="isDaytimeOnly" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Solo para uso diurno</FormLabel>
                    </div>
                  </FormItem>
                )}/>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={handleClose}>Cancelar</Button>
              <Button type="submit">Guardar Punto</Button>
            </DialogFooter>
          </form>
          {/* Opciones de acción al guardar */}
          <ActionChoiceModal />
        </Form>
      </DialogContent>
    </Dialog>
  );
};
