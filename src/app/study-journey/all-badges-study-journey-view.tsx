import { AchievementWithStatsResponse, CompletedAchievementResponse } from "@trophyso/node/api";
import { useEffect, useState } from "react";
import { getAllAchievements } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import AllBadgesBadge from "./all-badges-badge";

interface Props {
    userAcheivements: CompletedAchievementResponse[];
}

export default function AllBadgesStudyJourneyView({
    userAcheivements
}: Props) {
    const [loading, setLoading] = useState(false);
    const [achievements, setAchievements]
        = useState<Record<"metric" | "streak" | "api", AchievementWithStatsResponse[]>>();

    useEffect(() => {
        const fetchAchievements = async () => {
            setLoading(true);

            const achievements = await getAllAchievements();

            if (!achievements) {
                setLoading(false);
                return;
            }

            // Group by trigger
            const groupedAchievements = achievements.reduce((acc, achievement) => {
                acc[achievement.trigger] = acc[achievement.trigger] || [];
                acc[achievement.trigger].push(achievement);
                return acc;
            }, {} as Record<string, AchievementWithStatsResponse[]>);

            setAchievements(groupedAchievements);

            setLoading(false);
        }
        fetchAchievements();
    }, []);

    return (
        <>
            {loading ? (
                <div className="grid grid-cols-3 gap-2 w-full" >
                    {
                        Array(3).fill(0).map((_, idx) => (
                            <div key={idx} className="p-3 rounded-md border border-gray-200 flex flex-col gap-3 items-center justify-between shadow-sm min-h-[130px]">
                                <Skeleton className="w-[75px] h-[75px] rounded-full" />
                                <div className="flex flex-col gap-1 w-full items-center justify-center">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-2 w-1/2" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            ) : achievements && Object.keys(achievements).length > 0 ? (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                    <div>
                        <p className="text-gray-500 font-semibold">
                            {achievements && achievements['metric']?.length > 0 && achievements['metric'][0]?.metricName}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {achievements?.['metric']?.map((achievement) => {
                            const completed = userAcheivements.find(
                                a => a.id === achievement.id
                            );

                            return (
                                <AllBadgesBadge
                                    key={achievement.id}
                                    achievement={achievement}
                                    completed={!!completed}
                                />
                            )
                        })}
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">
                            Streaks
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {achievements?.["streak"]?.map((achievement) => {
                            const completed = userAcheivements.find(
                                a => a.id === achievement.id
                            );

                            return (
                                <AllBadgesBadge
                                    key={achievement.id}
                                    achievement={achievement}
                                    completed={!!completed}
                                />
                            )
                        })}
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">
                            Other
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {achievements?.["api"]?.map((achievement) => {
                            const completed = userAcheivements.find(
                                a => a.id === achievement.id
                            );

                            return (
                                <AllBadgesBadge
                                    key={achievement.id}
                                    achievement={achievement}
                                    completed={!!completed}
                                />
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1 items-center justify-center min-h-[100px] p-3 w-full mt-3">
                    <p className='font-semibold text-lg'>
                        No badges yet
                    </p>
                </div>
            )}
        </>
    )
}