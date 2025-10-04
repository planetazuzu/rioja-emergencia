
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Ambulance as AmbulanceIcon, 
  Plane, 
  Clock,
} from 'lucide-react';
import { ETA, Ambulance, Helicopter } from '../types/emergency';
import { formatETA } from '../utils/calculations';

interface ETAListProps {
  etas: ETA[];
  ambulances: Ambulance[];
  helicopter: Helicopter | null;
  onAssignResource: (resourceId: string) => void;
  assignedResources: string[];
}

export const ETAList: React.FC<ETAListProps> = ({ etas, ambulances, helicopter, onAssignResource, assignedResources }) => {
  if (etas.length === 0) return null;

  return (
    <div className="p-4">
      <h2 className="font-semibold text-emergency-orange mb-3 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Tiempos de Llegada (ETA)
      </h2>
      
      <div className="space-y-2">
        {etas.map(eta => {
          const resource = eta.resourceType === 'ambulance' 
            ? ambulances.find(amb => amb.id === eta.resourceId)
            : helicopter;
          
          if (!resource) return null;
          const isAssigned = assignedResources.includes(resource.id);

          return (
            <Card key={eta.resourceId} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {eta.resourceType === 'ambulance' ? (
                    <AmbulanceIcon className="h-4 w-4 text-emergency-red" />
                  ) : (
                    <Plane className="h-4 w-4 text-emergency-blue" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{resource.name}</p>
                    <p className="text-xs text-gray-500">{eta.distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-bold">
                    {formatETA(eta.eta)}
                  </Badge>
                  <Button
                    size="sm"
                    variant={isAssigned ? "secondary" : "default"}
                    onClick={() => onAssignResource(resource.id)}
                    disabled={!resource.available && !isAssigned}
                    className="w-24 text-xs"
                  >
                    {isAssigned ? "Liberar" : "Asignar"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
