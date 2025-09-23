import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardRankings from "./leaderboard-rankings";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LeaderboardResponseWithRankings, UserLeaderboardResponse } from "@trophyso/node/api";
import { getLeaderboard, getUserLeaderboard } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserId } from "@/lib/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dayjs, { Dayjs, ManipulateType, OpUnitType } from "dayjs";

interface QueryState {
    limit?: number;
    offset?: number;
    userId?: string;
    runDate?: string;
}


export default function DefaultView() {
    const [query, setQuery] = useState<QueryState>({
        limit: 10,
        offset: 0,
        userId: undefined,
        runDate: dayjs().format("YYYY-MM-DD")
    });
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
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

        setUserLeaderboard(userLeaderboard);
        setLoadingUserLeaderboard(false);
    }, [query.runDate]);

    useEffect(() => {
        fetchUserLeaderboard();
    }, [fetchUserLeaderboard]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    const handleTabChange = (value: string) => {
        if (value === "you") {
            setQuery({
                limit: 10,
                offset: -5,
                userId: getUserId(),
                runDate: query.runDate
            });
            return;
        }

        setQuery({
            runDate: query.runDate,
            limit: parseInt(value)
        });
    };

    const currentTab = useMemo(() => {
        if (query.userId) {
            return "you";
        }
        return query.limit?.toString() || "10";
    }, [query]);

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
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-center">
                {loadingUserLeaderboard && (
                    <Skeleton className="w-1/3 h-20 rounded-xl" />
                )}
                {!loadingUserLeaderboard && (
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <p className="text-2xl font-bold">
                            {userLeaderboard?.rank || "Unranked"}
                        </p>
                        <p className="text-sm text-gray-500">
                            {userLeaderboard?.rank ? `Ranked #${userLeaderboard.rank} out of ${leaderboard?.maxParticipants || 0}` : "Keep flipping flashcards to earn a ranking!"}
                        </p>
                    </div>
                )}
            </div>
            <div>
                <Tabs
                    value={currentTab}
                    onValueChange={handleTabChange}
                >
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="10">
                                Top 10
                            </TabsTrigger>
                            <TabsTrigger value="100">
                                Top 100
                            </TabsTrigger>
                            <TabsTrigger value="1000">
                                Top 1,000
                            </TabsTrigger>
                            <TabsTrigger value="you">
                                You
                            </TabsTrigger>
                        </TabsList>
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
                    {loadingLeaderboard && (
                        <Skeleton className="w-full h-72 rounded-xl" />
                    )}
                    {!loadingLeaderboard && (
                        leaderboard ? (
                            leaderboard.rankings.length > 0 ? (
                                <LeaderboardRankings
                                    leaderboard={leaderboard}
                                />
                            ) : (
                                <div className="flex flex-col gap-2 items-center justify-center h-72">
                                    <p className="text-center text-lg font-bold">
                                        No rankings yet
                                    </p>
                                    <p
                                        className="text-center text-sm text-gray-500"
                                    >
                                        Flip a flashcard to start your streak and earn XP!
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col gap-2 items-center justify-center h-72">
                                <p className="text-center text-lg font-bold">
                                    Could not load leaderboard
                                </p>
                                <p
                                    className="text-center text-sm text-gray-500"
                                >
                                    Please try again later
                                </p>
                            </div>
                        ))}
                </Tabs>
            </div>
        </div>
    )
}