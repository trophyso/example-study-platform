import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPoints } from "@/contexts/UserPointsContext";
import { useEffect, useMemo, useState } from "react";
import { Sparkle } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import DefaultView from "./default-view";
import { View } from "./types";
import HowToEarnView from "./how-to-earn-view";

export default function PointsCenter() {
  const [open, setOpen] = useState(false);
  const { points, lastPoints, loading: pointsLoading } = useUserPoints();
  const [view, setView] = useState<View>("default");

  useEffect(() => {
    if (open) {
      setView("default");
    }
  }, [open])

  const title = useMemo(() => {
    switch (view) {
      case "how-to-earn":
        return "How to earn XP";
      default:
        return "Your XP";
    }
  }, [view]);

  const description = useMemo(() => {
    switch (view) {
      case "how-to-earn":
        return "Earn XP by viewing flashcards and keeping your streak alive";
      default:
        return "Keep studying to earn more XP";
    }
  }, [view]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative rounded-full h-10 w-30 border mt-1.5 cursor-pointer">
          <div className="rounded-full bg-gray-50 text-sm font-semibold absolute w-full h-full top-1/2 -translate-y-1/2 flex items-center gap-1 pl-3 inset-shadow-sm">
            {pointsLoading && !points ? (
              <Skeleton className="h-5 w-12 rounded-full" />
            ) : (
              <>
                <Sparkle className="size-4" />
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
              <Sparkle className="size-4" />
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