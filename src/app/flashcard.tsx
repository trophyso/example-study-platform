'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { IFlashcard } from "@/types/flashcard";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./flashcard.module.css";

interface Props {
    flashcard: IFlashcard;
}

export default function Flashcard({ flashcard }: Props) {
    const [side, setSide] = useState<"front" | "back">("front");

    const handleCardClick = () => {
        if (side === "front") {
            setSide("back");
        }
    }

    return (
        <CarouselItem key={flashcard.id}>
            <div className="p-1">
                <motion.div
                    onClick={handleCardClick}
                    className="cursor-pointer"
                    animate={{ rotateY: side === "front" ? 0 : 180 }}
                    transition={{ duration: 1, type: "spring" }}
                    style={{ perspective: "1000px" }}
                >
                    <Card className={`relative w-full h-[200px] ${styles.card}`}>
                        <CardContent className={`flex items-center justify-center p-6 absolute w-full h-full ${styles.backface_hidden}`}>
                            <span
                                className={`text-4xl text-center font-semibold ${side === "back" ? styles.flipped_text : ""}`}
                            >
                                {side === "front" ? flashcard.front : flashcard.back}
                            </span>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </CarouselItem>
    )
}