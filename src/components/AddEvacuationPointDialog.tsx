
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EvacuationPoint } from '../types/emergency';

interface AddEvacuationPointDialogProps {
  coords: { lat: number, lng: number } | null;
  onClose: () => void;
  onSave: (pointData: Omit<EvacuationPoint, 'id' | 'lat' | 'lng'>) => void;
}

export const AddEvacuationPointDialog: React.FC<AddEvacuationPointDialogProps> = ({ coords, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [description, setDescription] = useState('');
  const [isDaytimeOnly, setIsDaytimeOnly] = useState(false);

  useEffect(() => {
    if (!coords) {
      setName('');
      setLocality('');
      setDescription('');
      setIsDaytimeOnly(false);
    }
  }, [coords]);

  const handleSave = () => {
    if (!name || !locality) {
      alert('El nombre y la localidad son obligatorios.');
      return;
    }

    onSave({
      name,
      locality,
      description,
      status: 'available',
      restrictions: 'Ninguna',
      isDaytimeOnly,
    });
  };

  return (
    <Dialog open={!!coords} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Punto de Aterrizaje</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo punto. Este punto se guardará solo para la sesión actual.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="locality" className="text-right">
              Localidad
            </Label>
            <Input id="locality" value={locality} onChange={(e) => setLocality(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="flex items-center space-x-2 col-start-2 col-span-3">
            <Checkbox id="daytime" checked={isDaytimeOnly} onCheckedChange={(checked) => setIsDaytimeOnly(!!checked)} />
            <label
              htmlFor="daytime"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Solo uso diurno
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Punto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
