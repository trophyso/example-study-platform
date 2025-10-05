import { useEffect, useState } from "react";
import { useUserEnergy } from "@/contexts/UserEnergyContext";
import { getUserId } from "@/lib/user";
import { getEnergySummary } from "@/app/actions";
import { UsersPointsEventSummaryResponseItem } from "@trophyso/node/api";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AreaChartLinearGradient } from "@/components/charts/area-chart-linear-gradient";
import { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import dayjs from "dayjs";
import { View } from "./types";

const chartConfig = {
  energy: {
    label: "Energy",
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
  const { energy } = useUserEnergy();
  const [energySummary, setEnergySummary] = useState<UsersPointsEventSummaryResponseItem[] | null>(null);

  useEffect(() => {
    async function fetchEnergyData() {
      setLoading(true);

      const userId = getUserId();
      const data = await getEnergySummary(userId);

      setEnergySummary(data);
      setLoading(false);
    }

    fetchEnergyData();
  }, [])

  const handleViewHowToRechargeClick = () => {
    setView("how-to-recharge");
  }

  return (
    <div className="flex flex-col gap-3 w-full min-h-[500px]">
      <div className="flex flex-col items-center justify-center my-4 gap-1">
        <div className="flex items-center justify-center gap-1">
          <NumberTicker
            value={energy?.total || 0}
            duration={0.1}
            className="text-4xl font-medium"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">
            Current Energy
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">
          Energy usage this week
        </p>
      </div>
      <div className="min-h-[125px]">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : energySummary ? (
          <AreaChartLinearGradient
            height={100}
            // @ts-expect-error - This is actually fine
            data={energySummary}
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
          Latest energy changes
        </p>
        <Button variant="link" size="sm" className="pr-0 text-black text-xs underline" onClick={handleViewHowToRechargeClick}>
          How do I recharge?
        </Button>
      </div>
      <div className="flex flex-col gap-2 divide-y divide-gray-100">
        {energy?.awards?.map((award) => (
          <div key={award.id} className="flex items-center justify-between gap-2 text-sm py-0.5">
            <p className="text-gray-500">
              {dayjs(award.date).format("DD-MM-YYYY")}
            </p>
            <p className="font-semibold">{award.total}</p>
            <div className="flex items-center gap-1">
              <p className="font-semibold">{award.awarded ? `${award.awarded > 0 ? '+' : ''}${award.awarded}` : ''}</p>
              <Zap className="size-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
