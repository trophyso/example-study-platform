import { flashcards } from "@/data";
import Flashcards from "./flashcards";
import { Toaster } from "@/components/ui/sonner"
import StudyJourney from "./study-journey";
import { getAchievements, getStreak } from "./actions";
import PoweredBy from "./powered-by";

export default async function Home() {
  const achievements = await getAchievements();
  const streak = await getStreak();

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <StudyJourney achievements={achievements} streak={streak} />
      <Flashcards flashcards={flashcards} />
      <Toaster />
      <PoweredBy />
    </div>
  )
}
