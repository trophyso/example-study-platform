import { Separator } from "@/components/ui/separator";
import { MultiStageAchievementResponse, StreakResponse } from "@trophyso/node/api";
import { Flame, GraduationCap } from "lucide-react";
import Image from "next/image";
import dayjs from 'dayjs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getAchievements } from "./actions";
import { useEffect, useState } from "react";
import { getStreak } from "./actions";
import { getUserId } from "@/lib/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudyJourney() {
    const [data, setData] = useState<{
        achievements: MultiStageAchievementResponse[] | null;
        streak: StreakResponse | null;
    }>({
        achievements: null,
        streak: null
    });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        const fetchData = async () => {
            const userId = getUserId();

            setLoading(true);

            const achievements = await getAchievements(userId);
            const streak = await getStreak(userId);

            setData({
                achievements,
                streak
            });

            setLoading(false);
        };
        fetchData();
    }, [open]);

    return (
        <div className="absolute top-10 right-10 z-50 cursor-pointer">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <div className="h-12 w-12 cursor-pointer duration-100 border-1 border-gray-300 shadow-sm transition-all rounded-full relative hover:bg-gray-100">
                        <GraduationCap className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800" />
                    </div>
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-3 min-w-[500px]">
                    {/* Heading */}
                    <DialogHeader>
                        <DialogTitle>
                            Your study journey
                        </DialogTitle>
                        <DialogDescription>
                            Keep studying to extend your streak and earn new badges
                        </DialogDescription>
                    </DialogHeader>

                    {/* Streak */}
                    <div className="flex flex-col gap-2 items-center justify-between pt-2">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative h-24 w-24">
                                {loading ? (
                                    <Skeleton className="w-[100px] h-[100px] rounded-full" />
                                ) : (
                                    <>
                                        <svg className="h-full w-full" viewBox="0 0 100 100">
                                            <circle
                                                className="stroke-primary/20"
                                                strokeWidth="10"
                                                fill="transparent"
                                                r="45"
                                                cx="50"
                                                cy="50"
                                            />
                                            <circle
                                                className="stroke-primary transition-all"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                fill="transparent"
                                                r="45"
                                                cx="50"
                                                cy="50"
                                                strokeDasharray={`${(data.streak?.length || 0) * 10} 1000`}
                                                transform="rotate(-90 50 50)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-primary">{data.streak?.length || 0}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col text-center">
                                <h3 className="text-lg font-semibold">
                                    {data.streak && data.streak.length > 0 ? `Your study streak` : `No study streak`}
                                </h3>
                                {loading ? (
                                    <Skeleton className="h-3 mt-1 w-full" />
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        {data.streak && data.streak.length > 0 ? `${data.streak.length} day${data.streak.length > 1 ? 's' : ''} in a row` : `Start a streak`}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="grid grid-cols-7 gap-1">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="h-10 flex items-center justify-center">
                                        <span className="text-sm text-gray-500">{day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {loading ? Array(14).fill(0).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                                    >
                                        <Skeleton className="h-10 w-10" />
                                    </div>
                                )) : (data.streak?.streakHistory || Array(14).fill(0)).map((day, i) => (
                                    <div
                                        key={i}
                                        className={`h-10 w-10 rounded-lg ${day.length > 0 ? 'bg-primary' : 'bg-primary/10'
                                            } flex items-center justify-center`}
                                    >
                                        <Flame className={`h-6 w-6 ${day.length > 0 ? 'text-white' : 'text-primary/30'
                                            }`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Achievements */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <p className="text-lg font-semibold">
                                Your badges
                            </p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {Array(3).fill(0).map((_, idx) => (
                                <div key={idx} className="p-3 rounded-md border border-gray-200 flex flex-col gap-3 items-center justify-between shadow-sm min-h-[130px]">
                                    <Skeleton className="w-[75px] h-[75px] rounded-full" />
                                    <div className="flex flex-col gap-1 w-full items-center justify-center">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-2 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : data.achievements && data.achievements.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {data.achievements?.map((achievement) => (
                                <div key={achievement.id} className="p-2 rounded-md border border-gray-200 flex flex-col gap-1 items-center shadow-sm">
                                    <Image
                                        src={achievement.badgeUrl as string}
                                        alt={achievement.name as string}
                                        width={100}
                                        height={100}
                                        className="rounded-full border-gray-300"
                                    />
                                    <p className="font-semibold">{achievement.name}</p>
                                    <p className="text-gray-500 text-sm">
                                        {dayjs(achievement.achievedAt).format('MMM D, YYYY')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 items-center justify-center min-h-[100px] p-3 w-full mt-3">
                            <p className='font-semibold text-lg'>
                                No badges yet
                            </p>
                            <p className="text-sm text-gray-500 text-center max-w-[200px]">
                                Keep studying to unlock more badges!
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}