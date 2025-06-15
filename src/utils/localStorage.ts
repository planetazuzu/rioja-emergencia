
import { EvacuationPoint } from '../types/emergency';

const STORAGE_KEY = 'emergency-evacuation-points';

export const saveCustomPointsToLocal = (points: EvacuationPoint[]): void => {
  try {
    const data = JSON.stringify(points);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error("Error saving evacuation points to local storage:", error);
  }
};

export const loadCustomPointsFromLocal = (): EvacuationPoint[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as EvacuationPoint[];
    }
    return [];
  } catch (error) {
    console.error("Error loading evacuation points from local storage:", error);
    return [];
  }
};
