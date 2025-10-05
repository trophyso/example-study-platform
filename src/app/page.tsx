'use client';

import { flashcards } from "@/data";
import Flashcards from "./flashcards";
import { Toaster } from "@/components/ui/sonner"
import PoweredBy from "./powered-by";
import { UserPointsProvider } from "@/contexts/UserPointsContext";
import { UserEnergyProvider } from "@/contexts/UserEnergyContext";
import { UserIdentificationProvider } from "@/contexts/UserIdentificationContext";
import UserCenter from "./user-center/user-center";
import LeaderboardCenter from "./leaderboard-center/leaderboard-center";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <UserIdentificationProvider>
        <UserPointsProvider>
          <UserEnergyProvider>
            <UserCenter />
            <LeaderboardCenter />
            <Flashcards flashcards={flashcards} />
          </UserEnergyProvider>
        </UserPointsProvider>
      </UserIdentificationProvider>
      <PoweredBy />
      <Toaster />
    </div>
  )
}
