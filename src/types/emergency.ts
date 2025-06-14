
export interface Ambulance {
  id: string;
  name: string;
  type: 'SVB' | 'SVA';
  lat: number;
  lng: number;
  base: string;
  schedule: string;
  available: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface Helicopter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  base: string;
  available: boolean;
  speed: number; // km/h
}

export interface EvacuationPoint {
  id: string;
  name: string;
  locality: string;
  lat: number;
  lng: number;
  description: string;
  status: 'available' | 'unavailable';
  restrictions: string;
  isDaytimeOnly: boolean;
}

export interface Emergency {
  id: string;
  lat: number;
  lng: number;
  address: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  requiresHelicopter: boolean;
  assignedResources: string[];
}

export interface ETA {
  resourceId: string;
  resourceType: 'ambulance' | 'helicopter';
  eta: number; // minutes
  distance: number; // km
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'ambulances' | 'helicopter' | 'evacuation_points' | 'coverage_zones' | 'incidents';
}
