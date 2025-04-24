import { flashcards } from "@/data";
import Flashcards from "./flashcards";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Flashcards flashcards={flashcards} />
    </div>
  )
}
