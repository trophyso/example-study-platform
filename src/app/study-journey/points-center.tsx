import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPoints } from "@/contexts/UserPointsContext";
import { useState } from "react";
import { Sparkle } from "lucide-react";

export default function PointsCenter() {
  const { points, loading } = useUserPoints();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative rounded-full h-10 w-30 border mt-1.5 cursor-pointer">
          <div className="rounded-full bg-gray-50 text-sm font-semibold absolute w-full h-full top-1/2 -translate-y-1/2 flex items-center gap-1 pl-3 inset-shadow-sm">
            {loading ? (
              <Skeleton className="h-5 w-12 rounded-full" />
            ) : (
              <>
                <Sparkle className="size-4" />
                <span>{points?.total || 0}</span>
              </>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-3 min-w-[500px] min-h-[500px]">
        {/* Heading */}
        <DialogHeader>
          <DialogTitle>
            Your points
          </DialogTitle>
          <DialogDescription>
            Keep studying to earn more points
          </DialogDescription>
        </DialogHeader>

        Test
      </DialogContent>
    </Dialog>
  )
}