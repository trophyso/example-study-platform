'use client';

import { flashcards } from "@/data";
import Flashcards from "./flashcards";
import { Toaster } from "@/components/ui/sonner"
import StudyJourney from "./study-journey";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <StudyJourney />
      <Flashcards flashcards={flashcards} />
      <Toaster />
    </div>
  )
}
