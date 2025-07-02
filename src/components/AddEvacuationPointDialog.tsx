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
import { EvacuationPoint } from '../types/emergency';
import { toast } from '@/components/ui/use-toast';
import { EvacuationPointForm, evacuationPointFormSchema } from './EvacuationPointForm';
import { submitProposal, EvacPointWithContact } from '../services/evacuationPointService';

type LocalEvacPoint = Omit<EvacuationPoint, 'id' | 'status' | 'restrictions'> & {
  id: string;
  status?: string;
  restrictions?: string;
  email?: string;
  phone?: string;
};

const LOCAL_STORAGE_KEY = "evacuation-point-borradores-v2";

interface AddEvacuationPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pointData: Omit<EvacuationPoint, 'id'>) => void;
}

export const AddEvacuationPointDialog: React.FC<AddEvacuationPointDialogProps> = ({ open, onOpenChange, onSave }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [borradores, setBorradores] = useState<LocalEvacPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm<z.infer<typeof evacuationPointFormSchema>>({
    resolver: zodResolver(evacuationPointFormSchema),
    defaultValues: {
      name: '',
      locality: '',
      description: '',
      lat: 0,
      lng: 0,
      createdBy: '',
      isDaytimeOnly: false,
      email: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) setBorradores(JSON.parse(raw));
      } catch { /* no-op */ }
    }
  }, [open]);

  function saveBorradores(newBorradores: LocalEvacPoint[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBorradores));
    setBorradores(newBorradores);
  }

  function guardarBorrador(data: EvacPointWithContact) {
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

  async function enviarPropuesta(datos: EvacPointWithContact, quitarLocalId?: string) {
    setLoading(true);
    try {
      await submitProposal(datos);
      toast({
        title: "Propuesta enviada",
        description: "Tu propuesta ha sido enviada para revisión.",
      });
      if (quitarLocalId) {
        eliminarBorrador(quitarLocalId);
      }
      resetAll();
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

  const createPointData = (values: z.infer<typeof evacuationPointFormSchema>): EvacPointWithContact => {
    return {
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
      email: values.email,
      phone: values.phone,
    };
  };

  const handleSaveToDevice = (values: z.infer<typeof evacuationPointFormSchema>) => {
    setFormError("");
    const pointData = createPointData(values);
    guardarBorrador(pointData);
    onSave({
      name: pointData.name,
      locality: pointData.locality,
      lat: pointData.lat,
      lng: pointData.lng,
      description: pointData.description,
      status: pointData.status,
      restrictions: pointData.restrictions || "Ninguna",
      isDaytimeOnly: pointData.isDaytimeOnly,
      createdBy: pointData.createdBy,
      photos: pointData.photos,
    });
    resetAll();
  };

  const handleShareForReview = async (values: z.infer<typeof evacuationPointFormSchema>) => {
    setFormError("");
    const pointData = createPointData(values);

    if (
      (!pointData.email || pointData.email.trim() === "") &&
      (!pointData.phone || pointData.phone.trim() === "")
    ) {
      setFormError("Para compartir para revisión, por favor indica al menos un correo electrónico o teléfono de contacto.");
      return;
    }
    
    await enviarPropuesta(pointData);
    onSave({
      name: pointData.name,
      locality: pointData.locality,
      lat: pointData.lat,
      lng: pointData.lng,
      description: pointData.description,
      status: pointData.status,
      restrictions: pointData.restrictions || "Ninguna",
      isDaytimeOnly: pointData.isDaytimeOnly,
      createdBy: pointData.createdBy,
      photos: pointData.photos,
    });
  };
  
  const resetAll = () => {
    form.reset();
    setPhotos([]);
    setFormError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir/Proponer Punto de Aterrizaje</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo punto.
          </DialogDescription>
        </DialogHeader>
        <EvacuationPointForm 
          form={form} 
          photos={photos}
          onPhotoUpload={handlePhotoUpload}
          formError={formError}
        >
          <DialogFooter className="pt-4 border-t flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-2">
            <Button variant="outline" type="button" onClick={resetAll} disabled={loading}>
              Cancelar
            </Button>
            <Button type="button" onClick={form.handleSubmit(handleSaveToDevice)} disabled={loading}>
                Guardar en dispositivo
            </Button>
            <Button type="button" onClick={form.handleSubmit(handleShareForReview)} disabled={loading}>
                Compartir para revisión
            </Button>
          </DialogFooter>
        </EvacuationPointForm>
      </DialogContent>
    </Dialog>
  );
};
