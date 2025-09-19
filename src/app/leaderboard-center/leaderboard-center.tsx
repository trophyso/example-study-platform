import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLeaderboard } from "../actions";
import { useEffect, useState } from "react";
import { LeaderboardResponseWithRankings } from "@trophyso/node/api";
import LeaderboardButton from "./leaderboard-button";
import LeaderboardIcon from "@/components/icons/leaderboard";
import DefaultView from "./default-view";

export default function LeaderboardCenter() {
    const [leaderboard, setLeaderboard]
        = useState<LeaderboardResponseWithRankings | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            const leaderboard = await getLeaderboard();
            setLeaderboard(leaderboard);
            setLoading(false);
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50">
            <Dialog>
                <DialogTrigger>
                    {!loading && leaderboard && (
                        <LeaderboardButton leaderboard={leaderboard} />
                    )}
                </DialogTrigger>
                <DialogContent>
                    {!loading && leaderboard && (
                        <div className="flex flex-col gap-3">
                            <DialogTitle className="flex items-center gap-2">
                                <LeaderboardIcon className="size-5" />
                                {leaderboard.name}
                            </DialogTitle>
                            <DialogDescription>
                                {leaderboard.description}
                            </DialogDescription>
                            <DefaultView />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}