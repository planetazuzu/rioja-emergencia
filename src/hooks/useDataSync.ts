import { useState, useEffect, useCallback } from 'react';
import { dataSyncService, EvacuationPointsData, ETATeamsData } from '../services/dataSyncService';
import { EvacuationPoint } from '../types/emergency';

export interface DataSyncState {
  evacuationPoints: EvacuationPoint[];
  etaTeams: any[];
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
  version: string | null;
}

export const useDataSync = () => {
  const [state, setState] = useState<DataSyncState>({
    evacuationPoints: [],
    etaTeams: [],
    loading: true,
    error: null,
    lastUpdate: null,
    version: null
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [pointsData, teamsData] = await Promise.all([
        dataSyncService.loadEvacuationPoints(),
        dataSyncService.loadETATeams()
      ]);

      setState({
        evacuationPoints: pointsData.points,
        etaTeams: teamsData.teams,
        loading: false,
        error: null,
        lastUpdate: pointsData.lastUpdated,
        version: pointsData.version
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error cargando datos'
      }));
    }
  }, []);

  const refreshData = useCallback(async () => {
    dataSyncService.clearCache();
    await loadData();
  }, [loadData]);

  const checkForUpdates = useCallback(async () => {
    try {
      const updates = await dataSyncService.checkForUpdates();
      return updates;
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    refreshData,
    checkForUpdates,
    loadData
  };
};
