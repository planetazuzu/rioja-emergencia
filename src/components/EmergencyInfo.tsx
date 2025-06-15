
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  AlertTriangle,
  Navigation,
  XCircle,
} from 'lucide-react';
import { Emergency, EvacuationPoint } from '../types/emergency';

interface EmergencyInfoProps {
  currentEmergency: Emergency | null;
  nearestEvacuationPoint: EvacuationPoint | null;
  onClearEmergency: () => void;
}

export const EmergencyInfo: React.FC<EmergencyInfoProps> = ({
  currentEmergency,
  nearestEvacuationPoint,
  onClearEmergency,
}) => {
  return (
    <>
      {/* Información de emergencia actual */}
      {currentEmergency && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emergency-red animate-pulse-emergency" />
              <h2 className="font-semibold text-emergency-red">Emergencia Activa</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-600 rounded-full"
              onClick={onClearEmergency}
              aria-label="Cerrar emergencia"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
          
          <Card className="p-3 bg-red-50 border-red-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{currentEmergency.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{currentEmergency.timestamp.toLocaleTimeString()}</span>
              </div>
              <Badge variant="destructive" className="w-fit">
                Prioridad {currentEmergency.priority.toUpperCase()}
              </Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Punto de evacuación recomendado */}
      {nearestEvacuationPoint && (
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-emergency-blue mb-3 flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Punto de Evacuación
          </h2>
          
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">{nearestEvacuationPoint.name}</h3>
              <p className="text-sm text-blue-700">{nearestEvacuationPoint.locality}</p>
              <p className="text-xs text-blue-600">{nearestEvacuationPoint.description}</p>
              <Badge variant="secondary" className="w-fit">
                {nearestEvacuationPoint.status === 'available' ? 'Disponible' : 'No disponible'}
              </Badge>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
