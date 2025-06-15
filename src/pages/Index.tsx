
import EmergencyMap from '../components/EmergencyMap';
// import ReviewForm from '../components/ReviewForm'; // Eliminado, ya no mostramos el formulario lateral
import { LandingPointLocationProvider } from "../components/LandingPointLocationContext";

const Index = () => {
  return (
    <LandingPointLocationProvider>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1">
          <EmergencyMap />
        </div>
        {/* 
        <div className="w-full md:w-[400px] shrink-0">
          <ReviewForm />
        </div>
        */}
      </div>
    </LandingPointLocationProvider>
  );
};

export default Index;

