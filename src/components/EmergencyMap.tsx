
import React from 'react';
import { EmergencyMapLayout } from './EmergencyMapLayout';
import { useEmergencyMapState } from '../hooks/useEmergencyMapState';

const EmergencyMap: React.FC = () => {
  const emergencyMapState = useEmergencyMapState();

  // Pasa la lógica a EmergencyMapLayout como prop
  return <EmergencyMapLayout {...emergencyMapState} />;
};

export default EmergencyMap;
