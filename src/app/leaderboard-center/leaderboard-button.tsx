import LeaderboardIcon from "@/components/icons/leaderboard";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { LeaderboardResponseWithRankings } from "@trophyso/node/api";
import dayjs, { OpUnitType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
    leaderboard: LeaderboardResponseWithRankings;
}


export default function LeaderboardButton({ leaderboard }: Props) {
    return (
        <ShinyButton>
            <div className="flex gap-3 items-center">
                <LeaderboardIcon className="size-5" />
                <p className="text-sm">
                    {`${leaderboard.name}: Ending in ${dayjs(leaderboard.end).endOf(leaderboard.runUnit as OpUnitType).toNow(false)}`}
                </p>
            </div>
        </ShinyButton>
    )
}