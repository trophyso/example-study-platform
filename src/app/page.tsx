import { flashcards } from "@/data";
import Flashcards from "./flashcards";
import { Toaster } from "@/components/ui/sonner"
import Userbox from "./userbox";
import { getAchievements, getStreak } from "./actions";

export default async function Home() {
  const achievements = await getAchievements();
  const streak = await getStreak();

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <Userbox achievements={achievements} streak={streak} />
      <Flashcards flashcards={flashcards} />
      <Toaster />
    </div>
  )
}
