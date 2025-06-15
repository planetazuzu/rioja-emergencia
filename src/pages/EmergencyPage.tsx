
import { LandingPointLocationProvider } from "../components/LandingPointLocationContext";
import EmergencyMap from "../components/EmergencyMap";

const EmergencyPage = () => {
  return (
    <LandingPointLocationProvider>
      <div className="w-full h-screen flex flex-col">
        <div className="flex-1 min-h-0">
          <EmergencyMap />
        </div>
      </div>
    </LandingPointLocationProvider>
  );
};

export default EmergencyPage;
