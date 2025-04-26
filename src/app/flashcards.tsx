'use client';

import { Carousel, CarouselContent, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { IFlashcard } from "@/types/flashcard";
import Flashcard from "./flashcard";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

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

        // Update the flash index when the carousel is scrolled
        api.on("select", () => {
            setFlashIndex(api.selectedScrollSnap() + 1);
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