
import { Ambulance, Helicopter, EvacuationPoint, ETA } from '../types/emergency';

// Función para calcular distancia haversine (en línea recta)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Función para calcular distancia por carretera (aproximación usando factor de corrección)
export function calculateRoadDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const straightDistance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  // Factor de corrección para carreteras (aproximadamente 1.3x la distancia en línea recta)
  return straightDistance * 1.3;
}

// Función para encontrar el punto de evacuación más cercano
export function findNearestEvacuationPoint(
  incidentLat: number,
  incidentLng: number,
  evacuationPoints: EvacuationPoint[]
): EvacuationPoint | null {
  if (evacuationPoints.length === 0) return null;

  let nearest = evacuationPoints[0];
  let minDistance = calculateHaversineDistance(
    incidentLat,
    incidentLng,
    nearest.lat,
    nearest.lng
  );

  evacuationPoints.forEach(point => {
    if (point.status === 'available') {
      const distance = calculateHaversineDistance(
        incidentLat,
        incidentLng,
        point.lat,
        point.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = point;
      }
    }
  });

  return nearest;
}

// Función para calcular ETA de ambulancias
export function calculateAmbulanceETA(
  ambulance: Ambulance,
  targetLat: number,
  targetLng: number,
  averageSpeed: number = 60
): ETA {
  const currentLat = ambulance.currentLocation?.lat || ambulance.lat;
  const currentLng = ambulance.currentLocation?.lng || ambulance.lng;
  
  const distance = calculateRoadDistance(currentLat, currentLng, targetLat, targetLng);
  const eta = (distance / averageSpeed) * 60; // Convertir a minutos

  return {
    resourceId: ambulance.id,
    resourceType: 'ambulance',
    eta: Math.round(eta),
    distance: Math.round(distance * 100) / 100,
  };
}

// Función para calcular ETA del helicóptero
export function calculateHelicopterETA(
  helicopter: Helicopter,
  targetLat: number,
  targetLng: number
): ETA {
  const distance = calculateHaversineDistance(
    helicopter.lat,
    helicopter.lng,
    targetLat,
    targetLng
  );
  const eta = (distance / helicopter.speed) * 60; // Convertir a minutos

  return {
    resourceId: helicopter.id,
    resourceType: 'helicopter',
    eta: Math.round(eta),
    distance: Math.round(distance * 100) / 100,
  };
}

// Función para calcular todos los ETAs
export function calculateAllETAs(
  ambulances: Ambulance[],
  helicopter: Helicopter,
  targetLat: number,
  targetLng: number,
  averageAmbulanceSpeed: number = 60
): ETA[] {
  const ambulanceETAs = ambulances
    .filter(amb => amb.available)
    .map(amb => calculateAmbulanceETA(amb, targetLat, targetLng, averageAmbulanceSpeed));

  const helicopterETA = calculateHelicopterETA(helicopter, targetLat, targetLng);

  return [...ambulanceETAs, helicopterETA].sort((a, b) => a.eta - b.eta);
}

// Función para formatear tiempo
export function formatETA(eta: number): string {
  if (eta < 60) {
    return `${eta}min`;
  } else {
    const hours = Math.floor(eta / 60);
    const minutes = eta % 60;
    return `${hours}h ${minutes}min`;
  }
}
