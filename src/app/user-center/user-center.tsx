import StudyJourney from "./study-center/study-journey";
import PointsCenter from "./points-center/points-center";

export default function UserCenter() {
  return (
    <div className="absolute top-10 right-10 z-50">
      <PointsCenter />
      <StudyJourney />
    </div>
  )
}