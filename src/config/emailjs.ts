// Configuración de EmailJS
// Para configurar EmailJS:
// 1. Ve a https://www.emailjs.com/
// 2. Crea una cuenta gratuita
// 3. Crea un servicio de email (Gmail, Outlook, etc.)
// 4. Crea una plantilla de email
// 5. Obtén tu Public Key
// 6. Reemplaza los valores de abajo con tus credenciales reales

export const EMAILJS_CONFIG = {
  // Reemplaza con tu Service ID de EmailJS
  SERVICE_ID: 'YOUR_SERVICE_ID',
  
  // Reemplaza con tu Template ID de EmailJS
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
  
  // Reemplaza con tu Public Key de EmailJS
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
  
  // Email donde quieres recibir las propuestas de puntos de evacuación
  RECIPIENT_EMAIL: 'emergencias@larioja.org',
};

// Función para verificar si EmailJS está configurado
export const isEmailJSConfigured = (): boolean => {
  return EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
         EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
         EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
};

// Mensaje de error cuando EmailJS no está configurado
export const EMAILJS_NOT_CONFIGURED_MESSAGE = 
  'EmailJS no está configurado. Contacta al administrador para configurar el envío de emails.';
