import { Carousel, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { IFlashcard } from "@/types/flashcard";
import Flashcard from "./flashcard";

interface Props {
    flashcards: IFlashcard[];
}

export default function Flashcards({ flashcards }: Props) {
    return (
        <Carousel className="w-full max-w-md">
            <CarouselContent>
                {flashcards.map((flashcard) => (
                    <Flashcard key={flashcard.id} flashcard={flashcard} />
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}