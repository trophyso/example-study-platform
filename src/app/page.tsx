import { flashcards } from "@/data";
import Flashcards from "./flashcards";
import { Toaster } from "@/components/ui/sonner"
import Userbox from "./userbox";
import { getProgress } from "./actions";

export default async function Home() {
  const progress = await getProgress();

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <Userbox progress={progress} />
      <Flashcards flashcards={flashcards} />
      <Toaster />
    </div>
  )
}
