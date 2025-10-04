
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Filter } from 'lucide-react';
import { MapLayer } from '../types/emergency';

interface MapLayersProps {
  mapLayers: MapLayer[];
  showFilters: boolean;
  ambulanceFilter: 'all' | 'SVB' | 'SVA' | 'available';
  onToggleLayer: (layerId: string) => void;
  onToggleFilters: () => void;
  onAmbulanceFilterChange: (filter: 'all' | 'SVB' | 'SVA' | 'available') => void;
}

export const MapLayers: React.FC<MapLayersProps> = ({
  mapLayers,
  showFilters,
  ambulanceFilter,
  onToggleLayer,
  onToggleFilters,
  onAmbulanceFilterChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Visibilidad de Capas</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {mapLayers.map(layer => (
          <div key={layer.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{layer.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLayer(layer.id)}
            >
              {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        ))}
      </div>

      {showFilters && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Filtros Ambulancias</h3>
          <div className="space-y-1">
            {['all', 'SVB', 'SVA', 'available'].map(filter => (
              <Button
                key={filter}
                variant={ambulanceFilter === filter ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => onAmbulanceFilterChange(filter as typeof ambulanceFilter)}
              >
                {filter === 'all' ? 'Todas' : 
                 filter === 'available' ? 'Disponibles' : filter}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
