import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserEnergy } from "@/contexts/UserEnergyContext";
import { useEffect, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import DefaultView from "./default-view";
import { View } from "./types";
import HowToRechargeView from "./how-to-recharge-view";

export default function EnergyCenter() {
  const [open, setOpen] = useState(false);
  const { energy, lastEnergy, loading: energyLoading } = useUserEnergy();
  const [view, setView] = useState<View>("default");
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (open) {
      setView("default");
    }
  }, [open])

  // Trigger pulsing animation when energy changes
  useEffect(() => {
    if (energy?.total !== lastEnergy?.total && energy?.total !== undefined) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [energy?.total, lastEnergy?.total]);

  const title = useMemo(() => {
    switch (view) {
      case "how-to-recharge":
        return "How to recharge energy";
      default:
        return "Your Energy";
    }
  }, [view]);

  const description = useMemo(() => {
    switch (view) {
      case "how-to-recharge":
        return "Learn how to restore your energy to continue studying";
      default:
        return "Manage your energy to keep studying";
    }
  }, [view]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative rounded-full flex items-center justify-center h-10 w-15 border mt-1.5 cursor-pointer">
          <div className="rounded-full bg-gray-50 text-sm font-semibold absolute w-full h-full top-1/2 -translate-y-1/2 flex items-center gap-1 pl-3 inset-shadow-sm">
            {energyLoading && !energy ? (
              <Skeleton className="h-5 w-12 rounded-full" />
            ) : (
              <>
                <Zap className={`size-4 transition-all duration-1000 ${isPulsing ? 'animate-pulse' : ''}`} />
                <NumberTicker
                  value={energy?.total || 0}
                  startValue={lastEnergy?.total || 0}
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
              <Zap className="size-4" />
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

        {view === "how-to-recharge" && (
          <HowToRechargeView />
        )}
      </DialogContent>
    </Dialog>
  )
}
