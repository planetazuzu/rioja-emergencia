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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPhotos: string[] = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setPhotos(prev => [...prev, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

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
    onSave(pointData);
    form.reset();
    setPhotos([]);
    onOpenChange(false);
  };
  
  const handleClose = () => {
    form.reset();
    setPhotos([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Punto de Aterrizaje</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo punto. Se guardará para la sesión actual.
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="lat" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitud</FormLabel>
                      <FormControl><Input type="number" placeholder="42.2245" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="lng" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitud</FormLabel>
                      <FormControl><Input type="number" placeholder="-2.1018" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
