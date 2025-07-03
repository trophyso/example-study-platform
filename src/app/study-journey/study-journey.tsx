import { CompletedAchievementResponse, StreakResponse } from "@trophyso/node/api";
import { GraduationCap } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getAchievements } from "../actions";
import { useEffect, useMemo, useState } from "react";
import { getStreak } from "../actions";
import { getUserId } from "@/lib/user";
import DefaultStudyJourneyView from "./default-study-journey-view";
import AllBadgesView from "./all-badges-view";
import { View } from "./types";

export default function StudyJourney() {
  const [data, setData] = useState<{
    achievements?: CompletedAchievementResponse[];
    streak?: StreakResponse;
  }>({
    achievements: undefined,
    streak: undefined,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("default");

  useEffect(() => {
    if (!open) {
      return;
    }

    setView("default");

    const fetchData = async () => {
      const userId = getUserId();

      setLoading(true);

      const [achievements, streak] = await Promise.all([
        getAchievements(userId),
        getStreak(userId),
      ]);

      setData({
        achievements: achievements || undefined,
        streak: streak || undefined,
      });

      setLoading(false);
    };
    fetchData();
  }, [open]);

  const title = useMemo(() => {
    switch (view) {
      case "all-badges":
        return "All badges";
      default:
        return "Your study journey";
    }
  }, [view]);

  const description = useMemo(() => {
    switch (view) {
      case "all-badges":
        return "See what badges you can earn";
      default:
        return "Keep studying to extend your streak and earn new badges";
    }
  }, [view]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="h-12 w-12 cursor-pointer duration-100 border-1 border-gray-300 shadow-sm transition-all rounded-full bg-white hover:bg-gray-100 absolute right-0 top-1/2 -translate-y-1/2">
          <GraduationCap className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800" />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-3 min-w-[500px] min-h-[500px]">
        {/* Heading */}
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {view === "default" && (
          <DefaultStudyJourneyView
            loading={loading}
            achievements={data.achievements}
            streak={data.streak}
            setView={setView}
          />
        )}

        {view === "all-badges" && (
          <AllBadgesView
            userAcheivements={data.achievements || []}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}