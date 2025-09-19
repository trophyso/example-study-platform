import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardRankings from "./leaderboard-rankings";
import { useCallback, useEffect, useState } from "react";
import { LeaderboardResponseWithRankings, UserLeaderboardResponse } from "@trophyso/node/api";
import { getLeaderboard, getUserLeaderboard } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserId } from "@/lib/user";


export default function DefaultView() {
    const [limit, setLimit] = useState(10);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [loadingUserLeaderboard, setLoadingUserLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardResponseWithRankings | null>(null);
    const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboardResponse | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        setLoadingLeaderboard(true);

        const leaderboard = await getLeaderboard(limit);

        setLeaderboard(leaderboard);
        setLoadingLeaderboard(false);
    }, [limit]);

    const fetchUserLeaderboard = useCallback(async () => {
        const userId = getUserId();
        setLoadingUserLeaderboard(true);

        const userLeaderboard = await getUserLeaderboard(userId);
        console.log(userLeaderboard);

        setUserLeaderboard(userLeaderboard);
        setLoadingUserLeaderboard(false);
    }, []);

    useEffect(() => {
        fetchUserLeaderboard();
    }, [fetchUserLeaderboard]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    return (
        <div className="flex flex-col gap-2">
            <div>
                {loadingUserLeaderboard && <Skeleton className="w-full h-50" />}
                {!loadingUserLeaderboard && userLeaderboard && (
                    <p>{userLeaderboard.rank}</p>
                )}
            </div>
            <div>
                <Tabs
                    value={limit.toString()}
                    onValueChange={
                        (value) => setLimit(parseInt(value))
                    }
                >
                    <TabsList>
                        <TabsTrigger value="10">
                            Top 10
                        </TabsTrigger>
                        <TabsTrigger value="100">
                            Top 100
                        </TabsTrigger>
                        <TabsTrigger value="1000">
                            Top 1000
                        </TabsTrigger>
                    </TabsList>
                    {loadingLeaderboard && <Skeleton className="w-full h-50" />}
                    {!loadingLeaderboard && leaderboard && (
                        <LeaderboardRankings leaderboard={leaderboard} />
                    )}
                </Tabs>
            </div>
        </div>
    )
}