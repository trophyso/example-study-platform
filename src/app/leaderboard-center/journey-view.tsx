import { useCallback, useEffect, useMemo, useState } from "react";
import { LeaderboardResponseWithRankings, UserLeaderboardResponse } from "@trophyso/node/api";
import { getLeaderboard, getUserLeaderboard } from "../actions";
import { getUserId } from "@/lib/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dayjs, { Dayjs, ManipulateType, OpUnitType } from "dayjs";
import { View } from "./types";
import { ChevronLeft } from "lucide-react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChartLinearGradient } from "@/components/charts/area-chart-linear-gradient";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const chartConfig = {
    value: {
        label: "Flashcards"
    },
    rank: {
        label: "Rank"
    },
} satisfies ChartConfig

interface QueryState {
    limit?: number;
    offset?: number;
    userId?: string;
    runDate?: string;
}

interface Props {
    changeView: (view: View) => void;
}

export default function JourneyView({
    changeView
}: Props) {
    const [query, setQuery] = useState<QueryState>({
        limit: 10,
        offset: 0,
        userId: undefined,
        runDate: dayjs().format("YYYY-MM-DD")
    });
    const [, setLoadingLeaderboard] = useState(false);
    const [loadingUserLeaderboard, setLoadingUserLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardResponseWithRankings | null>(null);
    const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboardResponse | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        setLoadingLeaderboard(true);

        const leaderboard = await getLeaderboard(
            query.limit,
            query.offset,
            query.userId,
            query.runDate
        );

        setLeaderboard(leaderboard);
        setLoadingLeaderboard(false);
    }, [query]);

    const fetchUserLeaderboard = useCallback(async () => {
        const userId = getUserId();
        setLoadingUserLeaderboard(true);
        const userLeaderboard = await getUserLeaderboard(userId, query.runDate);
        const sortedHistory = userLeaderboard?.history?.sort((a, b) => {
            if (!a?.timestamp || !b?.timestamp) return 0;
            return a.timestamp.getTime() - b.timestamp.getTime();
        }).map((event) => ({
            ...event,
            timestamp: dayjs(event?.timestamp).format("YYYY-MM-DD"),
            value: event?.value ?? 0
        }));

        setUserLeaderboard({
            ...userLeaderboard,
            // @ts-expect-error - Date vs string but who cares...
            history: sortedHistory
        });
        setLoadingUserLeaderboard(false);
    }, [query.runDate]);

    useEffect(() => {
        fetchUserLeaderboard();
    }, [fetchUserLeaderboard]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const runDates: Dayjs[] = useMemo(() => {
        if (!leaderboard?.start || !leaderboard?.runUnit) {
            return [];
        }

        const start = dayjs(leaderboard.start);
        const end = leaderboard.end ? dayjs(leaderboard.end) : dayjs();
        const unit = leaderboard.runUnit as OpUnitType;

        const dates = [];
        let current = start;

        while (current.isBefore(end) || current.isSame(end)) {
            dates.push(current);
            current = current.add(1, unit as ManipulateType);
        }

        return dates;
    }, [leaderboard]);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <DialogTitle
                    className="flex items-center gap-2"
                >
                    <ChevronLeft
                        className="size-5"
                        onClick={() => changeView("default")}
                    />
                    <p className="font-bold">Your journey</p>
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                    Track your progress over time
                </DialogDescription>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-center">
                    {!loadingUserLeaderboard && (
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold">
                                    Your journey
                                </p>
                            </div>
                            <p className="text-sm text-gray-500">
                                Track your progress over time
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-end">
                        <Select
                            value={query.runDate}
                            onValueChange={(value) => setQuery({ ...query, runDate: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Run" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {runDates.map((date: Dayjs) => {
                                        const dateKey =
                                            date.format("YYYY-MM-DD");
                                        const isYesterday = date.isSame(
                                            dayjs().subtract(1, "day"),
                                            "day"
                                        );
                                        const isToday = date.isSame(
                                            dayjs(),
                                            "day"
                                        );

                                        return (
                                            <SelectItem
                                                key={dateKey}
                                                value={dateKey}
                                            >
                                                {isToday ? "Today" : isYesterday ? "Yesterday" : date.format("MMM D, YYYY")}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="min-h-[160px]">
                            {loadingUserLeaderboard ? (
                                <Skeleton className="h-32 w-full" />
                            ) : userLeaderboard?.history ? (
                                <AreaChartLinearGradient
                                    height={100}
                                    // @ts-expect-error - This is actually fine
                                    data={userLeaderboard.history}
                                    xAxisKey="timestamp"
                                    yAxes={[
                                        {
                                            key: "rank",
                                            stroke: "var(--secondary)",
                                            fill: "var(--secondary)"
                                        },
                                        {
                                            key: "value",
                                            stroke: "var(--primary)",
                                            fill: "var(--primary)"
                                        }
                                    ]}
                                    chartConfig={chartConfig}
                                    tickFormatter={(value) => dayjs(value).fromNow()}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-sm">
                                        Nothing to display
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}