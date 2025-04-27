'use client';

import { Carousel, CarouselContent, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { IFlashcard } from "@/types/flashcard";
import Flashcard from "./flashcard";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { viewFlashcard } from "./actions";
import { toast } from "@/lib/toast";

interface Props {
    flashcards: IFlashcard[];
}

export default function Flashcards({ flashcards }: Props) {
    const [flashIndex, setFlashIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();

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

            // Show toast if the user has unlocked any new achievements
            if (response.achievements?.length) {
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

            // Show toast if user has extended their streak
            if (response.currentStreak?.extended) {
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