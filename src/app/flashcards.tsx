'use client';

import { Carousel, CarouselContent, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { IFlashcard } from "@/types/flashcard";
import Flashcard from "./flashcard";
import { useEffect, useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { viewFlashcard } from "./actions";
import { toast } from "@/lib/toast";
import { getUserId } from "@/lib/user";
import { useUserPoints } from "@/contexts/UserPointsContext";

interface Props {
    flashcards: IFlashcard[];
}

export default function Flashcards({ flashcards }: Props) {
    const [flashIndex, setFlashIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const achievementSound = useRef<HTMLAudioElement | null>(null);
    const streakSound = useRef<HTMLAudioElement | null>(null);
    const { refetch: refetchPoints } = useUserPoints();

    useEffect(() => {
        achievementSound.current = new Audio('/sounds/achievement_unlocked.mp3');
        streakSound.current = new Audio('/sounds/streak_extended.mp3');
    }, []);

    useEffect(() => {
        if (!api) {
            return;
        }

        // Initialize the flash index
        setFlashIndex(api.selectedScrollSnap() + 1);

        api.on("select", async () => {
            // Update flashIndex when the carousel is scrolled
            setFlashIndex(api.selectedScrollSnap() + 1);

            // Track the flashcard viewed event
            const userId = getUserId();
            const response = await viewFlashcard(userId);

            if (!response) {
                return;
            }

            if (response.achievements?.length) {
                // Play the achievement sound only once for all new achievements
                if (achievementSound.current) {
                    achievementSound.current.currentTime = 0;
                    achievementSound.current.play();
                }

                // Show toasts if the user has unlocked any new achievements
                response.achievements.forEach((achievement) => {
                    toast({
                        title: achievement.name as string,
                        description: achievement.description,
                        image: {
                            src: achievement.badgeUrl as string,
                            alt: achievement.name as string,
                        }
                    });
                });
            }

            if (response.currentStreak?.extended) {
                // Play the streak sound
                if (streakSound.current) {
                    streakSound.current.currentTime = 0;
                    streakSound.current.play();
                }

                // Show toast if the user has extended their streak
                toast({
                    title: "You're on a roll!",
                    description: `Keep going to keep your ${response.currentStreak.length} day streak!`,
                });
            }

            // Refresh points
            refetchPoints();
        });
    }, [api, refetchPoints]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 max-w-md">
            <Progress value={flashIndex / flashcards.length * 100} />
            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {flashcards.map((flashcard) => (
                        <Flashcard
                            key={flashcard.id}
                            flashcard={flashcard}
                        />
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}