import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getLeaderboard } from "../actions";
import { useEffect, useState } from "react";
import { LeaderboardResponseWithRankings } from "@trophyso/node/api";
import LeaderboardButton from "./leaderboard-button";
import DefaultView from "./default-view";
import { View } from "./types";
import JourneyView from "./journey-view";

export default function LeaderboardCenter() {
    const [leaderboard, setLeaderboard]
        = useState<LeaderboardResponseWithRankings | null>(null);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<View>("default");

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
                        <>
                            {view === "default" && (
                                <DefaultView changeView={setView} />
                            )}
                            {view === "journey" && (
                                <JourneyView changeView={setView} />
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}