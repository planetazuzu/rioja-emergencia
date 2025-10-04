# 📧 Configuración de EmailJS

Este documento explica cómo configurar EmailJS para que la aplicación pueda enviar emails cuando los usuarios propongan nuevos puntos de evacuación.

## 🚀 Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita (permite hasta 200 emails por mes)
3. Verifica tu email

### 2. Configurar un servicio de email
1. En el dashboard de EmailJS, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta de email
5. **Anota el Service ID** que se genera

### 3. Crear una plantilla de email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa esta plantilla como base:

```html
Subject: {{subject}}

Hola,

Se ha recibido una nueva propuesta de punto de evacuación:

**Información del punto:**
- Nombre: {{point_name}}
- Localidad: {{locality}}
- Descripción: {{description}}
- Coordenadas: {{coordinates}}
- Solo diurno: {{daytime_only}}
- Restricciones: {{restrictions}}
- Número de fotos: {{photos_count}}

**Información del contacto:**
- Nombre: {{from_name}}
- Email: {{from_email}}
- Teléfono: {{phone}}

Saludos,
Sistema de Emergencias La Rioja
```

4. **Anota el Template ID** que se genera

### 4. Obtener la Public Key
1. Ve a **Account** → **General**
2. Copia tu **Public Key**

### 5. Configurar la aplicación
1. Abre el archivo `src/config/emailjs.ts`
2. Reemplaza los valores:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'tu_service_id_aqui',
  TEMPLATE_ID: 'tu_template_id_aqui', 
  PUBLIC_KEY: 'tu_public_key_aqui',
  RECIPIENT_EMAIL: 'emergencias@larioja.org',
};
```

## 🔧 Variables disponibles en la plantilla

Puedes usar estas variables en tu plantilla de email:

- `{{subject}}` - Asunto del email
- `{{message}}` - Mensaje general
- `{{point_name}}` - Nombre del punto de evacuación
- `{{locality}}` - Localidad
- `{{description}}` - Descripción del punto
- `{{coordinates}}` - Coordenadas (lat, lng)
- `{{daytime_only}}` - Si es solo diurno (Sí/No)
- `{{restrictions}}` - Restricciones del punto
- `{{photos_count}}` - Número de fotos adjuntas
- `{{from_name}}` - Nombre de quien envía
- `{{from_email}}` - Email de contacto
- `{{phone}}` - Teléfono de contacto
- `{{to_email}}` - Email destinatario

## 🧪 Probar la configuración

1. Inicia la aplicación: `npm run dev`
2. Ve a la sección de "Añadir Punto de Evacuación"
3. Completa el formulario
4. Haz clic en "Compartir para revisión"
5. Verifica que recibes el email

## ⚠️ Solución de problemas

### Error: "EmailJS no está configurado"
- Verifica que has reemplazado todos los valores en `emailjs.ts`
- Asegúrate de que no hay espacios extra en las credenciales

### Error: "Invalid credentials"
- Verifica que el Service ID, Template ID y Public Key son correctos
- Asegúrate de que el servicio de email esté activo en EmailJS

### Error: "Template not found"
- Verifica que el Template ID es correcto
- Asegúrate de que la plantilla está publicada (no en borrador)

### No llegan los emails
- Revisa la carpeta de spam
- Verifica que el email destinatario está configurado correctamente
- Comprueba que no has excedido el límite de 200 emails/mes

## 📞 Soporte

Si tienes problemas con la configuración:
- Consulta la documentación de EmailJS: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Contacta al equipo técnico: emergencias@larioja.org
