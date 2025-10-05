'use client';

import { Carousel, CarouselContent, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IFlashcard } from "@/types/flashcard";
import Flashcard from "./flashcard";
import { useEffect, useState, useRef, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { viewFlashcard } from "./actions";
import { toast } from "@/lib/toast";
import { getUserId } from "@/lib/user";
import { useUserPoints } from "@/contexts/UserPointsContext";
import { useUserEnergy } from "@/contexts/UserEnergyContext";

interface Props {
    flashcards: IFlashcard[];
}

export default function Flashcards({ flashcards }: Props) {
    const [flashIndex, setFlashIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const achievementSound = useRef<HTMLAudioElement | null>(null);
    const streakSound = useRef<HTMLAudioElement | null>(null);
    const { refetch: refetchPoints } = useUserPoints();
    const { energy, refetch: refetchEnergy } = useUserEnergy();

    const handlePrevious = () => {
        if (!api) return;
        api.scrollPrev();
    };

    const handleNext = async () => {
        if (!api) return;

        // Check if user has enough energy before allowing navigation
        if (energy && energy.total <= 0) {
            toast({
                title: "Out of Energy!",
                description: "You need energy to view flashcards. Wait for it to regenerate or check how to recharge.",
            });
            return;
        }

        // Move to next slide
        api.scrollNext();
    };

    // Create a stable event handler
    const handleCarouselSelect = useCallback(async () => {
        if (!api) return;

        // Update flashIndex when the carousel is scrolled
        setFlashIndex(api.selectedScrollSnap() + 1);

        // Track the flashcard viewed event (this will consume energy via Trophy)
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

        // Refresh points and energy
        refetchPoints();
        refetchEnergy();
    }, [api, refetchPoints, refetchEnergy]);

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

        // Attach the stable event handler
        api.on("select", handleCarouselSelect);

        // Cleanup function to remove the event listener
        return () => {
            api.off("select", handleCarouselSelect);
        };
    }, [api, handleCarouselSelect]);

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
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute -left-5 top-1/2 -translate-y-1/2 -translate-x-full h-8 w-8 rounded-full"
                    onClick={handlePrevious}
                    disabled={flashIndex <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute -right-5 top-1/2 -translate-y-1/2 translate-x-full h-8 w-8 rounded-full"
                    onClick={handleNext}
                    disabled={flashIndex >= flashcards.length}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </Carousel>
        </div>
    )
}