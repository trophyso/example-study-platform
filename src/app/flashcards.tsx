'use client';

import { Carousel, CarouselContent, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { IFlashcard } from "@/types/flashcard";
import Flashcard from "./flashcard";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { viewFlashcard } from "./actions";
import { toast } from "@/lib/toast";
import useSound from 'use-sound';

interface Props {
    flashcards: IFlashcard[];
}

export default function Flashcards({ flashcards }: Props) {
    const [flashIndex, setFlashIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const [playAchievementUnlocked] = useSound('/sounds/achievement_unlocked.mp3');
    const [playStreakExtended] = useSound('/sounds/streak_extended.mp3');

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
            const response = await viewFlashcard();

            if (!response) {
                return;
            }

            if (response.achievements?.length) {
                console.log('playing achievement unlocked sound');
                // Play sound once if the user has unlocked any new achievements
                playAchievementUnlocked();

                // Show toasts if the user has unlocked any new achievements
                response.achievements.forEach((metricAchievements) => {
                    if (metricAchievements.completed?.length) {
                        metricAchievements.completed.forEach((achievement) => {
                            toast({
                                title: achievement.name as string,
                                description: `Congratulations! You've viewed ${achievement.metricValue} flashcards!`,
                                image: {
                                    src: achievement.badgeUrl as string,
                                    alt: achievement.name as string,
                                }
                            });
                        });
                    }
                });
            }

            if (response.currentStreak?.extended) {
                console.log('playing streak extended sound');
                // Play sound once if the user has extended their streak
                playStreakExtended();

                // Show toast if the user has extended their streak
                toast({
                    title: "You're on a roll!",
                    description: `Keep going to keep your ${response.currentStreak.length} day streak!`,
                });
            }
        });
    }, [api]);

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