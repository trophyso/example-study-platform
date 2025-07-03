'use client';

import { flashcards } from "@/data";
import Flashcards from "./flashcards";
import { Toaster } from "@/components/ui/sonner"
import PoweredBy from "./powered-by";
import { UserPointsProvider } from "@/contexts/UserPointsContext";
import UserCenter from "./study-journey/user-center";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <UserPointsProvider>
        <UserCenter />
        <Flashcards flashcards={flashcards} />
      </UserPointsProvider>
      <PoweredBy />
      <Toaster />
    </div>
  )
}
