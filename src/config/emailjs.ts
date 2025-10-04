// Configuración de EmailJS
// Las credenciales se cargan desde variables de entorno de Vite
// Crea un archivo .env en la raíz del proyecto con:
// VITE_EMAILJS_SERVICE_ID=tu_service_id
// VITE_EMAILJS_TEMPLATE_ID=tu_template_id
// VITE_EMAILJS_PUBLIC_KEY=tu_public_key

export const EMAILJS_CONFIG = {
  // Service ID desde variable de entorno
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  
  // Template ID desde variable de entorno
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  
  // Public Key desde variable de entorno
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
  
  // Email donde quieres recibir las propuestas de puntos de evacuación
  RECIPIENT_EMAIL: 'emergencias@larioja.org',
};

// Función para verificar si EmailJS está configurado
export const isEmailJSConfigured = (): boolean => {
  return EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
         EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
         EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
         EMAILJS_CONFIG.SERVICE_ID !== undefined &&
         EMAILJS_CONFIG.TEMPLATE_ID !== undefined &&
         EMAILJS_CONFIG.PUBLIC_KEY !== undefined;
};

// Mensaje de error cuando EmailJS no está configurado
export const EMAILJS_NOT_CONFIGURED_MESSAGE = 
  'EmailJS no está configurado. Contacta al administrador para configurar el envío de emails.';
