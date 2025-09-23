import { getUserId } from "@/lib/user";
import { cn } from "@/lib/utils";
import { LeaderboardResponseWithRankings } from "@trophyso/node/api";
import { Medal, Sparkle } from "lucide-react";

interface Props {
    leaderboard: LeaderboardResponseWithRankings;
}

function getMedalColor(rank: number): string {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "#808080";
}

export default function LeaderboardRankings({ leaderboard }: Props) {
    const userId = getUserId();

    return (
        <table className="w-full">
            <thead>
                <tr className="border-b">
                    <th className="text-left p-2">Rank</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2 flex items-center gap-2">
                        <Sparkle className="size-4" />
                        XP
                    </th>
                </tr>
            </thead>
            <tbody>
                {leaderboard.rankings.map((ranking, idx) => (
                    <tr
                        key={ranking.userId}
                        className={cn(
                            idx % 2 !== 0 && "bg-muted"
                        )}
                    >
                        <td className="text-left flex gap-2 items-center p-2">
                            {ranking.rank < 4 && (
                                <Medal
                                    className="size-4"
                                    style={{ color: getMedalColor(ranking.rank) }}
                                />
                            )}
                            <p
                                className={cn(
                                    ranking.userId === userId ? "font-bold" : ""
                                )}
                            >
                                {ranking.rank}
                            </p>
                        </td>
                        <td className={cn(
                            "text-left p-2",
                            ranking.userId === userId && "font-bold"
                        )}>
                            {ranking.userName || "Anonymous"}
                        </td>
                        <td className={cn(
                            "text-left p-2",
                            ranking.userId === userId && "font-bold"
                        )}>
                            {ranking.value}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}