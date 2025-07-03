import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPoints } from "@/contexts/UserPointsContext";
import { useEffect, useState } from "react";
import { Sparkle } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AreaChartLinearGradient } from "@/components/charts/area-chart-linear-gradient";
import { ChartConfig } from "@/components/ui/chart";
import { getPointsSummary } from "../actions";
import { getUserId } from "@/lib/user";
import { UsersPointsEventSummaryResponseItem } from "@trophyso/node/api";
import dayjs from "dayjs";

const chartConfig = {
  points: {
    label: "Points",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export default function PointsCenter() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { points, lastPoints, loading: pointsLoading } = useUserPoints();
  const [pointsSummary, setPointsSummary] = useState<UsersPointsEventSummaryResponseItem[] | null>(null);

  useEffect(() => {
    async function fetchPointsData() {
      setLoading(true);

      const userId = getUserId();
      const data = await getPointsSummary(userId);

      setPointsSummary(data);
      setLoading(false);
    }

    if (!open) return;

    fetchPointsData();
  }, [open])

  console.log(points);

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
        className="flex flex-col gap-3 min-w-[500px] min-h-[500px]"
      >
        {/* Heading */}
        <DialogHeader>
          <DialogTitle>
            Your points
          </DialogTitle>
          <DialogDescription>
            Keep studying to earn more points
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center justify-center my-5 gap-1">
            <div className="flex items-center justify-center gap-1">
              <NumberTicker
                value={points?.total || 0}
                duration={0.1}
                className="text-4xl font-medium"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Total points
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              Points earned this week
            </p>
          </div>
          <div className="min-h-[150px]">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : pointsSummary ? (
              <AreaChartLinearGradient
                height={100}
                data={pointsSummary}
                xAxisKey="date"
                yAxes={[
                  {
                    key: "total",
                    stroke: "var(--primary)",
                    fill: "var(--primary)"
                  }
                ]}
                chartConfig={chartConfig}
                tickFormatter={(value) => dayjs(value).format("ddd")}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500">
                  No points history yet
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              Latest awards
            </p>
          </div>
          <div className="flex flex-col gap-2 divide-y divide-gray-100">
            {points?.awards?.map((award) => (
              <div key={award.id} className="flex items-center justify-between gap-2 text-sm py-0.5">
                <p className="text-gray-500">{dayjs().format("DD-MM-YYYY")}</p>
                <p className="font-semibold">+{award.awarded}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}