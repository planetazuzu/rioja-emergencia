// Servicio para sincronizar datos desde archivos JSON del repositorio
import { EvacuationPoint } from '../types/emergency';

export interface DataVersion {
  lastUpdated: string;
  version: string;
}

export interface EvacuationPointsData extends DataVersion {
  points: EvacuationPoint[];
}

export interface ETATeam {
  id: string;
  name: string;
  type: 'medical' | 'rescue' | 'transport';
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    radio?: string;
  };
  capabilities: string[];
  equipment: string[];
  crew: {
    pilot: string;
    medic: string;
    technician: string;
  };
}

export interface ETATeamsData extends DataVersion {
  teams: ETATeam[];
}

class DataSyncService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Carga datos desde un archivo JSON con caché
   */
  private async loadJsonData<T>(url: string): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(url);
    
    // Verificar caché
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error cargando datos: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Guardar en caché
      this.cache.set(url, { data, timestamp: now });
      
      return data;
    } catch (error) {
      console.error(`Error cargando ${url}:`, error);
      throw error;
    }
  }

  /**
   * Carga puntos de evacuación desde el repositorio
   */
  async loadEvacuationPoints(): Promise<EvacuationPointsData> {
    return this.loadJsonData<EvacuationPointsData>('/data/evacuation-points.json');
  }

  /**
   * Carga equipos ETA desde el repositorio
   */
  async loadETATeams(): Promise<ETATeamsData> {
    return this.loadJsonData<ETATeamsData>('/data/eta-teams.json');
  }

  /**
   * Verifica si hay actualizaciones disponibles
   */
  async checkForUpdates(): Promise<{
    evacuationPoints: boolean;
    etaTeams: boolean;
    lastUpdate: string;
  }> {
    try {
      const [pointsData, teamsData] = await Promise.all([
        this.loadEvacuationPoints(),
        this.loadETATeams()
      ]);

      return {
        evacuationPoints: true,
        etaTeams: true,
        lastUpdate: pointsData.lastUpdated
      };
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
      return {
        evacuationPoints: false,
        etaTeams: false,
        lastUpdate: new Date().toISOString()
      };
    }
  }

  /**
   * Limpia la caché para forzar recarga
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtiene información de la versión de datos
   */
  async getDataVersion(): Promise<{
    evacuationPoints: DataVersion;
    etaTeams: DataVersion;
  }> {
    const [pointsData, teamsData] = await Promise.all([
      this.loadEvacuationPoints(),
      this.loadETATeams()
    ]);

    return {
      evacuationPoints: {
        lastUpdated: pointsData.lastUpdated,
        version: pointsData.version
      },
      etaTeams: {
        lastUpdated: teamsData.lastUpdated,
        version: teamsData.version
      }
    };
  }
}

// Instancia singleton
export const dataSyncService = new DataSyncService();
