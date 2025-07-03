import { AchievementWithStatsResponse } from "@trophyso/node/api";
import Image from "next/image";
import clsx from "clsx";

interface Props {
    achievement: AchievementWithStatsResponse;
    completed: boolean;
}

export default function AllBadgesBadge({ achievement, completed }: Props) {
    return (
        <div key={achievement.id} className="p-2 rounded-md border border-gray-200 flex flex-col gap-1 items-center shadow-sm">
            <Image
                src={achievement.badgeUrl as string}
                alt={achievement.name as string}
                width={100}
                height={100}
                className={clsx(
                    "rounded-full border-gray-300",
                    !completed && "grayscale opacity-30"
                )}
            />
            <p className={
                clsx(
                    "font-semibold",
                    !completed && "text-gray-500"
                )
            }>
                {achievement.name}
            </p>
            <p className={
                clsx(
                    "text-sm",
                    !completed && "text-gray-500"
                )
            }>
                {achievement.completedPercentage}% of users
            </p>
        </div>
    )
}