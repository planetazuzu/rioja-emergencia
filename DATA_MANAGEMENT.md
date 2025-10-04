# 📊 Gestión de Datos - Puntos de Aterrizaje y Equipos ETA

Este documento explica cómo actualizar los datos de puntos de aterrizaje y equipos ETA en la aplicación.

## 🔄 Sistema de Sincronización Automática

La aplicación carga automáticamente los datos desde archivos JSON almacenados en el repositorio de GitHub. Cuando actualices estos archivos y hagas push al repositorio, la aplicación se sincronizará automáticamente.

## 📁 Estructura de Archivos

```
public/data/
├── evacuation-points.json    # Puntos de evacuación/aterrizaje
└── eta-teams.json           # Equipos ETA (Equipos de Trabajo de Ambulancia)
```

## 🚁 Actualizar Puntos de Aterrizaje

### Archivo: `public/data/evacuation-points.json`

```json
{
  "lastUpdated": "2025-01-04T14:57:00Z",
  "version": "1.0.0",
  "points": [
    {
      "id": "ep-001",
      "name": "Hospital San Pedro",
      "locality": "Logroño",
      "description": "Helipuerto principal del hospital",
      "lat": 42.4627,
      "lng": -2.4449,
      "status": "available",
      "isDaytimeOnly": false,
      "restrictions": "Acceso restringido durante emergencias",
      "createdBy": "Sistema",
      "photos": [],
      "contact": {
        "phone": "941 291 100",
        "email": "emergencias@larioja.org"
      },
      "capacity": {
        "maxHelicopters": 2,
        "maxPeople": 50
      },
      "services": [
        "Atención médica",
        "Combustible",
        "Comunicaciones"
      ]
    }
  ]
}
```

### Campos obligatorios:
- `id`: Identificador único
- `name`: Nombre del punto
- `locality`: Localidad
- `lat`, `lng`: Coordenadas GPS
- `status`: "available", "unavailable", "maintenance"

### Campos opcionales:
- `description`: Descripción detallada
- `isDaytimeOnly`: Solo disponible de día
- `restrictions`: Restricciones de acceso
- `contact`: Información de contacto
- `capacity`: Capacidad del punto
- `services`: Servicios disponibles

## 🚑 Actualizar Equipos ETA

### Archivo: `public/data/eta-teams.json`

```json
{
  "lastUpdated": "2025-01-04T14:57:00Z",
  "version": "1.0.0",
  "teams": [
    {
      "id": "eta-001",
      "name": "ETA Logroño Centro",
      "type": "medical",
      "status": "available",
      "location": {
        "name": "Hospital San Pedro",
        "lat": 42.4627,
        "lng": -2.4449
      },
      "contact": {
        "phone": "941 291 100",
        "radio": "Canal 1"
      },
      "capabilities": [
        "Rescate médico",
        "Evacuación aérea"
      ],
      "equipment": [
        "Camilla aérea",
        "Equipo de oxígeno"
      ],
      "crew": {
        "pilot": "Juan Pérez",
        "medic": "María García",
        "technician": "Carlos López"
      }
    }
  ]
}
```

### Estados de equipos:
- `available`: Disponible
- `busy`: En misión
- `maintenance`: En mantenimiento
- `offline`: Fuera de servicio

## 🔧 Cómo Actualizar los Datos

### Método 1: Editar directamente en GitHub
1. Ve al repositorio en GitHub
2. Navega a `public/data/`
3. Haz clic en el archivo que quieres editar
4. Haz clic en el icono de lápiz (Edit)
5. Modifica el JSON
6. Haz commit con un mensaje descriptivo
7. ¡La app se actualizará automáticamente!

### Método 2: Editar localmente
1. Clona el repositorio
2. Edita los archivos JSON
3. Haz commit y push:
   ```bash
   git add public/data/
   git commit -m "feat: Actualizar puntos de aterrizaje - Hospital nuevo"
   git push origin master
   ```

### Método 3: Usar la interfaz web (Futuro)
- Próximamente se implementará una interfaz web para administradores

## 📝 Convenciones de Nomenclatura

### IDs de puntos de evacuación:
- Formato: `ep-XXX` (ej: `ep-001`, `ep-002`)
- Secuencial y único

### IDs de equipos ETA:
- Formato: `eta-XXX` (ej: `eta-001`, `eta-002`)
- Secuencial y único

### Versiones:
- Formato semántico: `MAJOR.MINOR.PATCH`
- Incrementar cuando hay cambios importantes

## 🔍 Validación de Datos

### Coordenadas GPS:
- Latitud: -90 a 90
- Longitud: -180 a 180
- Usar formato decimal (ej: 42.4627)

### Estados válidos:
- Puntos: "available", "unavailable", "maintenance"
- Equipos: "available", "busy", "maintenance", "offline"

### Tipos de equipos:
- "medical": Equipo médico
- "rescue": Equipo de rescate
- "transport": Equipo de transporte

## 🚨 Consideraciones Importantes

1. **Backup**: Siempre haz backup antes de cambios masivos
2. **Validación**: Verifica que el JSON sea válido antes de hacer commit
3. **Coordenadas**: Usa herramientas como Google Maps para obtener coordenadas precisas
4. **Contactos**: Mantén actualizada la información de contacto
5. **Versiones**: Incrementa la versión cuando hagas cambios importantes

## 🔄 Sincronización en Tiempo Real

La aplicación:
- Carga datos al iniciar
- Cachea datos por 5 minutos
- Permite actualización manual
- Muestra estado de sincronización
- Maneja errores de conexión

## 📞 Soporte

Si tienes problemas actualizando los datos:
- Verifica que el JSON sea válido
- Comprueba las coordenadas GPS
- Contacta al equipo técnico: emergencias@larioja.org
