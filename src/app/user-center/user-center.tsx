import StudyJourney from "./study-center/study-journey";
import PointsCenter from "./points-center/points-center";
import EnergyCenter from "../energy-center/energy-center";

export default function UserCenter() {
  return (
    <>
      {/* Energy in top left */}
      <div className="absolute top-10 left-10 z-50">
        <EnergyCenter />
      </div>

      {/* Points and Study Journey in top right */}
      <div className="absolute top-10 right-10 z-50">
        <PointsCenter />
        <StudyJourney />
      </div>
    </>
  )
}