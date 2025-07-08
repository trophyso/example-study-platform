import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPoints } from "@/contexts/UserPointsContext";
import { useEffect, useMemo, useState } from "react";
import { BatteryCharging, Sparkle } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import DefaultView from "./default-view";
import { View } from "./types";
import HowToEarnView from "./how-to-earn-view";

export default function PointsCenter() {
  const [open, setOpen] = useState(false);
  const { points, lastPoints, loading: pointsLoading } = useUserPoints();
  const [view, setView] = useState<View>("default");
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (open) {
      setView("default");
    }
  }, [open])

  // Trigger spinning animation when points change
  useEffect(() => {
    if (points?.total !== lastPoints?.total && points?.total !== undefined) {
      setIsSpinning(true);
      const timer = setTimeout(() => setIsSpinning(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [points?.total, lastPoints?.total]);

  const title = useMemo(() => {
    switch (view) {
      case "how-to-earn":
        return "How to earn energy";
      default:
        return "Your Energy";
    }
  }, [view]);

  const description = useMemo(() => {
    switch (view) {
      case "how-to-earn":
        return "Earn energy by viewing flashcards and keeping your streak alive";
      default:
        return "Keep studying to earn more energy";
    }
  }, [view]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative rounded-full h-10 w-32 border mt-1.5 cursor-pointer">
          <div className="rounded-full bg-gray-50 text-sm font-semibold absolute w-full h-full top-1/2 -translate-y-1/2 flex items-center gap-2 pl-3 inset-shadow-sm">
            {pointsLoading && !points ? (
              <Skeleton className="h-5 w-12 rounded-full" />
            ) : (
              <>
                <BatteryCharging className={`size-5 transition-transform duration-1000`} />
                <NumberTicker
                  value={points?.total || 0}
                  startValue={lastPoints?.total || 0}
                  duration={0.1}
                />
              </>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-3"
      >
        {/* Heading */}
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-1">
              <BatteryCharging className="size-6 mt-1" />
              {title}
            </div>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {view === "default" && (
          <DefaultView setView={setView} />
        )}

        {view === "how-to-earn" && (
          <HowToEarnView />
        )}
      </DialogContent>
    </Dialog>
  )
}