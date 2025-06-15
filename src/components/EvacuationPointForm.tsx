
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Locate } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { Button } from './ui/button';

export const evacuationPointFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  locality: z.string().min(1, "La localidad es obligatoria."),
  description: z.string().optional(),
  lat: z.coerce.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
  lng: z.coerce.number().min(-180, "Longitud inválida").max(180, "Longitud inválida"),
  createdBy: z.string().min(1, "El autor es obligatorio."),
  isDaytimeOnly: z.boolean().default(false),
  email: z.string().email("Email inválido").or(z.literal("")).optional(),
  phone: z.string().min(7, "Teléfono inválido").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof evacuationPointFormSchema>;

interface EvacuationPointFormProps {
  form: UseFormReturn<FormValues>;
  photos: string[];
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode; // For the DialogFooter
  formError?: string;
}

export const EvacuationPointForm: React.FC<EvacuationPointFormProps> = ({
  form,
  photos,
  onPhotoUpload,
  children,
  formError,
}) => {
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

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
        <ScrollArea className="h-[60vh] pr-6 flex-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <FormField control={form.control} name="lat" render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitud</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="42.2245" {...field} step="any" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <div className="flex flex-row gap-2 items-end">
                <FormField control={form.control} name="lng" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Longitud</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="-2.1018" {...field} step="any" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Obtener mi ubicación"
                  onClick={handleLocateMe}
                  title="Ubicarme automáticamente"
                >
                  <Locate className="h-4 w-4" />
                </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contacto</FormLabel>
                  <FormControl><Input type="email" placeholder="correo@ejemplo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de contacto</FormLabel>
                  <FormControl><Input type="tel" placeholder="Ej: 612345678" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
            <span className="block text-xs text-muted-foreground pt-1">
              El email o teléfono solo se usarán para comprobar la veracidad de la propuesta.
            </span>
            <FormItem>
              <FormLabel>Fotos de referencia</FormLabel>
              <FormControl>
                <Input type="file" multiple accept="image/*" onChange={onPhotoUpload} />
              </FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`preview ${index}`} className="rounded-md object-cover aspect-square w-full" />
                ))}
              </div>
            </FormItem>
            <FormField control={form.control} name="isDaytimeOnly" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
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
        {formError && (
            <div className="my-2 text-destructive bg-red-100 border border-red-300 rounded-md p-2 text-sm dark:bg-red-900/20 dark:border-red-800">{formError}</div>
        )}
        {children}
      </form>
    </Form>
  );
}
