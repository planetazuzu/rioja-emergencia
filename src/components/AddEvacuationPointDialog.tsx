
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
import { ActionChoiceModal } from './ActionChoiceModal';
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
  const [actionModal, setActionModal] = useState(false);
  const [pendingData, setPendingData] = useState<EvacPointWithContact | null>(null);
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

  const onSubmit = (values: z.infer<typeof evacuationPointFormSchema>) => {
    setFormError("");
    const pointData: EvacPointWithContact = {
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
    setPendingData(pointData);
    setActionModal(true);
  };
  
  const resetAll = () => {
    form.reset();
    setPhotos([]);
    setPendingData(null);
    setActionModal(false);
    onOpenChange(false);
  };

  const compartir = async (guardarTambien: boolean) => {
    if (!pendingData) return;
    setFormError("");
    if (
      (!pendingData.email || pendingData.email.trim() === "") &&
      (!pendingData.phone || pendingData.phone.trim() === "")
    ) {
      setFormError("Para compartir para revisión, por favor indica al menos un correo electrónico o teléfono de contacto.");
      return;
    }
    if (guardarTambien) {
      guardarBorrador(pendingData);
    }
    await enviarPropuesta(pendingData);
    resetAll();
  };

  return (
    <Dialog open={open} onOpenChange={resetAll}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir/Proponer Punto de Aterrizaje</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo punto.
          </DialogDescription>
        </DialogHeader>
        <EvacuationPointForm 
          form={form} 
          onSubmit={onSubmit}
          photos={photos}
          onPhotoUpload={handlePhotoUpload}
        >
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" type="button" onClick={resetAll}>Cancelar</Button>
            <Button type="submit">Guardar Punto</Button>
          </DialogFooter>
        </EvacuationPointForm>
        
        <ActionChoiceModal
          open={actionModal}
          loading={loading}
          formError={formError}
          onSaveOnly={() => { if (pendingData) { guardarBorrador(pendingData); resetAll(); } }}
          onShareOnly={() => compartir(false)}
          onSaveAndShare={() => compartir(true)}
          onCancel={resetAll}
        />
      </DialogContent>
    </Dialog>
  );
};
