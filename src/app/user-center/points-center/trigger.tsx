import { PointsTriggerResponse } from "@trophyso/node/api";
import { BatteryCharging, Sparkle } from "lucide-react";
import { useMemo } from "react";

interface Props {
    trigger: PointsTriggerResponse;
}

export default function PointsTrigger({ trigger }: Props) {

    const name = useMemo(() => {
        switch (trigger.type) {
            case "metric":
                return `Every ${trigger.metricThreshold} ${trigger.metricName?.toLowerCase()}`;
            case "streak":
                return `Every ${trigger.streakLengthThreshold} days streak`;
            case "achievement":
                return `Completing ${trigger.achievementName}`;
            default:
                return "Unknown trigger";
        }
    }, [trigger]);

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm">{name}</p>
            <p className="text-sm font-semibold flex items-center gap-1">
                +{trigger.points}
                <BatteryCharging className="size-4" />
            </p>
        </div>
    )
}