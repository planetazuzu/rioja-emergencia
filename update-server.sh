#!/bin/bash

# Script para actualizar el despliegue en el servidor
# Uso: ./update-server.sh

echo "🔄 Actualizando despliegue..."

# Ir al directorio del proyecto
cd /srv/emermap

# Actualizar código desde GitHub
echo "📥 Descargando cambios desde GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Error al descargar cambios"
    exit 1
fi

# Parar contenedores
echo "⏹️ Parando contenedores..."
docker compose down

# Reconstruir imagen
echo "🔨 Reconstruyendo aplicación..."
docker compose build

if [ $? -ne 0 ]; then
    echo "❌ Error en la construcción"
    exit 1
fi

# Iniciar contenedores
echo "🚀 Iniciando aplicación..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Error al iniciar contenedores"
    exit 1
fi

echo "✅ Actualización completada exitosamente!"
echo "🌐 La aplicación está disponible en el puerto 8094"

# Mostrar estado de los contenedores
echo "📊 Estado de los contenedores:"
docker ps
