import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard } from "@/types/flashcard";

interface Props {
    flashcards: Flashcard[];
}

export default function Flashcards({ flashcards }: Props) {
    return (
        <Carousel className="w-full max-w-md">
            <CarouselContent>
                {flashcards.map((flashcard) => (
                    <CarouselItem key={flashcard.id}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex items-center justify-center p-6">
                                    <span className="text-4xl text-center font-semibold">
                                        {flashcard.front}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}