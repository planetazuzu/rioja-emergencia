
import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionChoiceModalProps {
  open: boolean;
  loading: boolean;
  formError: string;
  onSaveOnly: () => void;
  onShareOnly: () => void;
  onSaveAndShare: () => void;
  onCancel: () => void;
}

export const ActionChoiceModal: React.FC<ActionChoiceModalProps> = ({
  open,
  loading,
  formError,
  onSaveOnly,
  onShareOnly,
  onSaveAndShare,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-background p-6 rounded-xl shadow-lg max-w-sm w-full text-center mx-4">
        <h3 className="font-bold text-lg mb-2">¿Qué deseas hacer?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Puedes guardar el formulario en tu dispositivo, compartirlo para revisión, o ambas cosas.
        </p>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md p-3 mb-4 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
          <strong>Aviso de privacidad:</strong> Tu email o teléfono solo se usarán para verificar y contactar en caso necesario sobre la propuesta, nunca para uso comercial.
        </div>
        {formError && (
          <div className="mb-3 text-destructive bg-red-100 border border-red-300 rounded-md p-2 text-sm dark:bg-red-900/20 dark:border-red-800">{formError}</div>
        )}
        <div className="flex flex-col gap-2">
          <Button
            variant="default"
            disabled={loading}
            onClick={onSaveOnly}
          >
            Guardar sólo en mi dispositivo
          </Button>
          <Button
            disabled={loading}
            onClick={onShareOnly}
          >
            Compartir sólo para revisión
          </Button>
          <Button
            disabled={loading}
            onClick={onSaveAndShare}
          >
            Guardar y compartir ambas cosas
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
