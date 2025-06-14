
import Map from '../components/Map'

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8">
      <h1 className="text-2xl font-bold mb-6 text-emergency-red">Mapa de Emergencias Sanitarias La Rioja</h1>
      <div className="w-full max-w-3xl">
        <Map />
      </div>
      <div className="mt-6 text-center text-gray-500 text-sm px-4">
        ¿No ves el mapa? <br />
        Introduce un Mapbox Public Token válido. Puedes obtenerlo gratis en <a className="text-blue-700 underline" href="https://mapbox.com/" target="_blank" rel="noopener">mapbox.com</a>.<br /> 
        ¿Tienes dudas? <a className="text-emergency-red underline" href="https://docs.lovable.dev/user-guides/quickstart" target="_blank" rel="noopener">Guía Lovable</a>
      </div>
    </div>
  );
};

export default Index;
