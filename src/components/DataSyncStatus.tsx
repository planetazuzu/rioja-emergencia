import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useDataSync } from '@/hooks/useDataSync';
import { toast } from '@/components/ui/use-toast';

export const DataSyncStatus: React.FC = () => {
  const { lastUpdate, version, loading, error, refreshData } = useDataSync();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast({
        title: "Datos actualizados",
        description: "Los datos se han sincronizado correctamente desde el repositorio.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudieron cargar los datos actualizados.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${diffDays} días`;
  };

  const getStatusIcon = () => {
    if (loading) return <Clock className="h-4 w-4 animate-spin" />;
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = () => {
    if (loading) return <Badge variant="secondary">Cargando...</Badge>;
    if (error) return <Badge variant="destructive">Error</Badge>;
    return <Badge variant="default">Actualizado</Badge>;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          Estado de Sincronización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estado:</span>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Versión:</span>
          <span className="text-sm font-mono">{version || 'N/A'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Última actualización:</span>
          <span className="text-sm">{formatLastUpdate(lastUpdate)}</span>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing || loading}
          size="sm"
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar datos'}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Los datos se sincronizan automáticamente desde el repositorio de GitHub
        </div>
      </CardContent>
    </Card>
  );
};
