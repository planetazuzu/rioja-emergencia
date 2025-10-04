
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Ambulance } from '../types/emergency';

interface MapCoverageCirclesProps {
    ambulances: Ambulance[];
    showCoverage: boolean;
}

const MapCoverageCircles: React.FC<MapCoverageCirclesProps> = ({ 
    ambulances, 
    showCoverage
}) => {
    const map = useMap();
    const circlesRef = useRef<L.Circle[]>([]);

    useEffect(() => {
        // Limpiar círculos anteriores
        circlesRef.current.forEach(circle => {
            map.removeLayer(circle);
        });
        circlesRef.current = [];

        if (!showCoverage) {
            return;
        }

        // Filtrar ambulancias disponibles
        const availableAmbulances = ambulances.filter(amb => amb.available);
        console.log("MapCoverageCircles - ambulancias disponibles para círculo:", availableAmbulances);

        // Crear círculos de cobertura para ambulancias disponibles
        availableAmbulances.forEach(ambulance => {
            const color = ambulance.type === 'SVA' ? '#ef4444' : '#22c55e'; // Rojo para SVA, Verde para SVB
            const radius = ambulance.type === 'SVA' ? 15000 : 10000; // 15km para SVA, 10km para SVB
            
            const circle = L.circle([ambulance.lat, ambulance.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.1,
                opacity: 0.3,
                radius: radius,
                weight: 2,
                dashArray: '5, 5'
            }).addTo(map);

            circlesRef.current.push(circle);
        });

    }, [map, ambulances, showCoverage]);

    return null;
};

export default MapCoverageCircles;

