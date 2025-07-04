import { Skeleton } from "@/components/ui/skeleton";
import { useUserPoints } from "@/contexts/UserPointsContext";
import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AreaChartLinearGradient } from "@/components/charts/area-chart-linear-gradient";
import { ChartConfig } from "@/components/ui/chart";
import { getPointsSummary } from "../../actions";
import { getUserId } from "@/lib/user";
import { UsersPointsEventSummaryResponseItem } from "@trophyso/node/api";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { View } from "./types";

const chartConfig = {
  points: {
    label: "XP",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface Props {
  setView: (view: View) => void;
}

export default function DefaultView({
  setView
}: Props) {
  const [loading, setLoading] = useState(false);
  const { points } = useUserPoints();
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
  }, [])

  const handleViewHowToEarnClick = () => {
    setView("how-to-earn");
  }

  return (
    <div className="flex flex-col gap-3 w-full min-h-[500px]">
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
            Total XP
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">
          XP earned this week
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
              Nothing to display
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">
          Latest awards
        </p>
        <Button variant="link" size="sm" className="pr-0 text-black text-xs underline" onClick={handleViewHowToEarnClick}>
          How do I earn XP?
        </Button>
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
  )
}