export default function HowToRechargeView() {
  return (
    <div className="flex flex-col gap-4 w-full mt-3">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
          1
        </div>
        <div className="flex-1">
          <h4 className="font-medium">Wait for Natural Regeneration</h4>
          <p className="text-sm text-gray-600">
            Energy automatically regenerates over time. Check back periodically to see your energy restored.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
          2
        </div>
        <div className="flex-1">
          <h4 className="font-medium">Complete Daily Challenges</h4>
          <p className="text-sm text-gray-600">
            Some achievements and leaderboards may reward you with energy bonuses.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
          3
        </div>
        <div className="flex-1">
          <h4 className="font-medium">Maintain Your Streak</h4>
          <p className="text-sm text-gray-600">
            Keeping your study streak alive may provide energy rewards as you progress.
          </p>
        </div>
      </div>
    </div>
  )
}
