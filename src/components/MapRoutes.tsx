
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Emergency, Ambulance, Helicopter } from '../types/emergency';

interface MapRoutesProps {
    currentEmergency: Emergency | null;
    ambulances: Ambulance[];
    helicopter: Helicopter | null;
}

const MapRoutes: React.FC<MapRoutesProps> = ({ currentEmergency, ambulances, helicopter }) => {
    const map = useMap();
    const routesRef = useRef<any[]>([]);

    useEffect(() => {
        // Limpiar rutas anteriores
        routesRef.current.forEach(route => {
            if (route instanceof L.Routing.Control) {
                map.removeControl(route);
            } else if (route instanceof L.Polyline) {
                map.removeLayer(route);
            }
        });
        routesRef.current = [];

        if (!currentEmergency || currentEmergency.assignedResources.length === 0) {
            return;
        }

        const emergencyLocation = L.latLng(currentEmergency.lat, currentEmergency.lng);

        currentEmergency.assignedResources.forEach(resourceId => {
            const ambulance = ambulances.find(a => a.id === resourceId);
            const resource = ambulance || (helicopter?.id === resourceId ? helicopter : null);

            if (resource) {
                const resourceLocation = L.latLng(resource.lat, resource.lng);
                const isHelicopter = !ambulance;

                if (isHelicopter) {
                    // Para el helicóptero, dibujamos una línea recta
                    const polyline = L.polyline([resourceLocation, emergencyLocation], {
                        color: '#3b82f6', // Azul
                        weight: 4,
                        opacity: 0.8,
                        dashArray: '10, 10'
                    }).addTo(map);
                    routesRef.current.push(polyline);
                } else {
                    // Para ambulancias, usamos el motor de rutas
                    const control = L.routing.control({
                        waypoints: [resourceLocation, emergencyLocation],
                        routeWhileDragging: false,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: false,
                        show: false, // Ocultar panel de itinerario
                        lineOptions: {
                            styles: [{ color: '#ef4444', opacity: 0.8, weight: 6 }] // Rojo
                        },
                        createMarker: () => null, // No crear marcadores adicionales
                    }).addTo(map);
                    routesRef.current.push(control);
                }
            }
        });

    }, [map, currentEmergency, ambulances, helicopter]);

    return null;
};

export default MapRoutes;
