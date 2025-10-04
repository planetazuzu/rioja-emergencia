# 🚀 Guía de Despliegue - Mapa de Ubicaciones de Ambulancias

Esta guía te ayudará a desplegar la aplicación en el puerto 8094 con la configuración completa de EmailJS.

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta en EmailJS (opcional, para funcionalidad de emails)

## 🔧 Configuración Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/planetazuzu/rioja-emergencia.git
cd rioja-emergencia
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración de EmailJS
VITE_EMAILJS_SERVICE_ID=service_dt7ahat
VITE_EMAILJS_TEMPLATE_ID=template_zxqmcne
VITE_EMAILJS_PUBLIC_KEY=M6wPFkV0_TidqqLWF

# Configuración del servidor (opcional)
PORT=8094
```

### 4. Configurar puerto en Vite
Edita `vite.config.ts` para usar el puerto 8094:

```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8094,  // Cambiar de 8080 a 8094
  },
  // ... resto de configuración
}));
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:8094`

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

#### 1. Preparar el proyecto
```bash
# Asegúrate de que todo esté en GitHub
git add .
git commit -m "feat: Configurar para despliegue en puerto 8094"
git push origin main
```

#### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub
3. Haz clic en **"New Project"**
4. Importa el repositorio: `planetazuzu/rioja-emergencia`

#### 3. Configurar variables de entorno en Vercel
En **Settings → Environment Variables**, agrega:

```
VITE_EMAILJS_SERVICE_ID = service_dt7ahat
VITE_EMAILJS_TEMPLATE_ID = template_zxqmcne
VITE_EMAILJS_PUBLIC_KEY = M6wPFkV0_TidqqLWF
```

#### 4. Configurar build settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 5. Desplegar
Haz clic en **"Deploy"**. Vercel asignará automáticamente una URL.

### Opción 2: Netlify

#### 1. Conectar con Netlify
1. Ve a [netlify.com](https://netlify.com)
2. **"New site from Git"** → Selecciona tu repositorio

#### 2. Configurar build
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: (dejar vacío)

#### 3. Variables de entorno
En **Site settings → Environment variables**:
```
VITE_EMAILJS_SERVICE_ID = service_dt7ahat
VITE_EMAILJS_TEMPLATE_ID = template_zxqmcne
VITE_EMAILJS_PUBLIC_KEY = M6wPFkV0_TidqqLWF
```

### Opción 3: Servidor propio (Puerto 8094)

#### 1. Construir la aplicación
```bash
npm run build
```

#### 2. Servir archivos estáticos
```bash
# Con serve (instalar: npm install -g serve)
serve -s dist -l 8094

# O con http-server (instalar: npm install -g http-server)
http-server dist -p 8094

# O con Python
cd dist
python -m http.server 8094
```

#### 3. Configurar proxy reverso (Nginx)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:8094;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Configuración Avanzada

### Variables de entorno adicionales
```env
# Configuración de EmailJS
VITE_EMAILJS_SERVICE_ID=service_dt7ahat
VITE_EMAILJS_TEMPLATE_ID=template_zxqmcne
VITE_EMAILJS_PUBLIC_KEY=M6wPFkV0_TidqqLWF

# Configuración del servidor
PORT=8094
HOST=0.0.0.0

# Configuración de la aplicación
VITE_APP_TITLE=Mapa de Ubicaciones de Ambulancias - La Rioja
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

### Scripts de package.json personalizados
```json
{
  "scripts": {
    "dev": "vite --port 8094",
    "build": "vite build",
    "preview": "vite preview --port 8094",
    "serve": "serve -s dist -l 8094",
    "deploy": "npm run build && npm run serve"
  }
}
```

## 🐳 Despliegue con Docker

### Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8094
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 8094;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8094:8094"
    environment:
      - VITE_EMAILJS_SERVICE_ID=service_dt7ahat
      - VITE_EMAILJS_TEMPLATE_ID=template_zxqmcne
      - VITE_EMAILJS_PUBLIC_KEY=M6wPFkV0_TidqqLWF
```

### Comandos Docker
```bash
# Construir imagen
docker build -t rioja-emergencia .

# Ejecutar contenedor
docker run -p 8094:8094 rioja-emergencia

# O con docker-compose
docker-compose up -d
```

## 🔍 Verificación del Despliegue

### 1. Verificar que la aplicación carga
- Visita `http://localhost:8094` (o tu dominio)
- Verifica que el título sea "Mapa de Ubicaciones de Ambulancias - La Rioja"

### 2. Probar funcionalidades
- ✅ Mapa interactivo carga correctamente
- ✅ Puntos de evacuación se muestran
- ✅ Equipos ETA aparecen en la lista
- ✅ Formulario de propuestas funciona
- ✅ EmailJS envía emails (si está configurado)

### 3. Verificar variables de entorno
Abre la consola del navegador y ejecuta:
```javascript
console.log('EmailJS configurado:', import.meta.env.VITE_EMAILJS_SERVICE_ID !== undefined);
```

## 🚨 Solución de Problemas

### Error: Puerto 8094 en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :8094  # macOS/Linux
netstat -ano | findstr :8094  # Windows

# Matar proceso
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Error: Variables de entorno no cargan
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo

### Error: EmailJS no funciona
- Verifica las credenciales en el archivo `.env`
- Comprueba que las variables estén configuradas en producción
- Revisa la consola del navegador para errores

### Error: Mapa no carga
- Verifica la conexión a internet
- Comprueba que no haya errores en la consola
- Asegúrate de que los archivos JSON estén accesibles

## 📞 Soporte

Para soporte técnico:
- **Email**: planetazuzu@gmail.com
- **Teléfono**: 661 804 828
- **Desarrollador**: Javier Fernández

## 🎯 URLs de Acceso

- **Desarrollo local**: `http://localhost:8094`
- **Vercel**: `https://rioja-emergencia.vercel.app`
- **Netlify**: `https://rioja-emergencia.netlify.app`
- **Servidor propio**: `http://tu-servidor:8094`

---

*Guía de despliegue para el Mapa de Ubicaciones de Ambulancias - La Rioja*
