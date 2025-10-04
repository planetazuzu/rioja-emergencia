# 🚑 Mapa de Ubicaciones de Ambulancias - La Rioja

Sistema web especializado para el seguimiento y visualización en tiempo real de las ubicaciones de ambulancias y servicios de emergencia en la Comunidad Autónoma de La Rioja.

## 📋 Descripción

Esta aplicación web proporciona herramientas especializadas para:

- **Seguimiento en tiempo real** de ubicaciones de ambulancias
- **Visualización de mapas interactivos** con posiciones actuales de vehículos
- **Gestión de puntos de evacuación** y rutas de emergencia
- **Coordinación de equipos de emergencia** (ETA)
- **Sistema de información geográfica** para servicios sanitarios
- **Aplicación web progresiva (PWA)** para acceso móvil

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Mapas**: Leaflet + React Leaflet
- **Base de datos**: Dexie (IndexedDB)
- **Routing**: React Router DOM
- **Formularios**: React Hook Form + Zod
- **Estado**: TanStack Query
- **Iconos**: Lucide React

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd rioja-emergencia-main
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
npm run dev
```

4. **Acceder a la aplicación**
   - Abrir navegador en: `http://localhost:8080`

## 📱 Características Principales

### 🗺️ Mapas Interactivos
- Visualización de ubicaciones de ambulancias en tiempo real
- Marcadores de puntos de evacuación
- Cálculo de rutas de emergencia
- Cobertura de servicios de emergencia

### 📊 Seguimiento de Ambulancias
- Monitoreo en tiempo real de posiciones
- Asignación de equipos ETA
- Estado de disponibilidad de vehículos
- Reportes y estadísticas de servicios

### 🏥 Puntos de Evacuación
- Registro y gestión de puntos de evacuación
- Información detallada de cada punto
- Capacidad y servicios disponibles
- Rutas de acceso

### 📱 Aplicación Web Progresiva (PWA)
- Instalable en dispositivos móviles
- Funcionamiento offline básico
- Notificaciones push (futuro)
- Interfaz adaptativa

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes UI reutilizables
│   ├── EmergencyMap.tsx # Componente principal del mapa
│   ├── ETAList.tsx     # Lista de equipos ETA
│   └── ...
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Servicios y APIs
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades
└── lib/                # Librerías y configuraciones
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run build:dev    # Construye en modo desarrollo

# Utilidades
npm run lint         # Ejecuta ESLint
npm run preview      # Vista previa de la build
```

## 🌐 Despliegue

### Producción

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Desplegar en servidor web**
   - Copiar contenido de `dist/` al servidor
   - Configurar servidor para servir archivos estáticos
   - Asegurar soporte para SPA routing

### Variables de Entorno

Crear archivo `.env` para configuración específica del entorno:

```env
VITE_API_URL=https://api.emergencias.larioja.org
VITE_MAP_API_KEY=tu_clave_de_mapas
```

## 📖 Documentación de APIs

### Servicios Locales
- **Dexie Database**: Gestión local de datos
- **EvacuationPointService**: Gestión de puntos de evacuación
- **LocalStorage**: Persistencia de configuraciones

### Integraciones Futuras
- API de emergencias sanitarias
- Sistema de notificaciones
- Integración con servicios de mapas externos

## 🤝 Contribución

### Flujo de trabajo

1. Fork del repositorio
2. Crear rama para feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de código

- Usar TypeScript estricto
- Seguir convenciones de ESLint configuradas
- Documentar componentes complejos
- Escribir tests para nuevas funcionalidades

## 📞 Soporte

Para soporte técnico o reportar incidencias:

- **Email**: planetazuzu@gmail.com
- **Teléfono**: 661 804 828
- **Desarrollador**: Javier Fernández

## 📄 Licencia

Este proyecto está desarrollado para la gestión de emergencias sanitarias de La Rioja. Todos los derechos reservados.

---

*Sistema desarrollado para el seguimiento y coordinación de ambulancias y servicios de emergencia de La Rioja*