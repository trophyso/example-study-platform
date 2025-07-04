import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getOverallPointsSummary, getPointsTriggers } from "../../actions";
import { PointsSummaryResponse, PointsTriggerResponse } from "@trophyso/node/api";
import PointsTrigger from "./trigger";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  points: {
    label: "XP",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export default function HowToEarnView() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    triggers: PointsTriggerResponse[] | undefined;
    summary: PointsSummaryResponse | undefined;
  }>();

  useEffect(() => {
    async function fetchPointsData() {
      setLoading(true);

      const [triggers, summary] = await Promise.all([
        getPointsTriggers(),
        getOverallPointsSummary()
      ]);

      setData({
        triggers: triggers || undefined,
        summary: summary?.filter(item => item.from !== 0) || undefined
      });
      setLoading(false);
    }

    if (!open) return;

    fetchPointsData();
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full min-h-[500px]">
      <div>
        <p className="text-sm font-semibold">
          All users
        </p>
      </div>
      <div className="min-h-[125px]">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : data?.summary ? (
          <BarChart
            // @ts-expect-error - This is actually fine
            data={data?.summary}
            xAxisKey="from"
            yAxis={{
              key: "users",
              stroke: "var(--primary)",
              fill: "var(--primary)"
            }}
            tickFormatter={(value) => parseInt(value) > 0 ? `${value}+` : "0"}
            chartConfig={chartConfig}
            height={125}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm">
              Nothing to display
            </p>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold">
          Ways to earn XP
        </p>
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : data?.triggers && data.triggers.length > 0 ? (
          <div className="flex flex-col gap-1">
            {data.triggers.map((trigger) => (
              <PointsTrigger key={trigger.id} trigger={trigger} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm">
              Nothing to display
            </p>
          </div>
        )}
      </div>
    </div>
  )
}