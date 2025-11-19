"use client";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/server/db/schema";
import { useState } from "react";
/*type FlashcardType = {
    id: string;
    flashcardSetId: string;
    term: string;
    definition: string;
};*/

interface FlashcardViewProps{
    flashcards: Flashcard[];
    currentIndex: number;
    onCardClick?: (index: number) => void;
};

const FlashcardView = ({
    flashcards,
    currentIndex,
    onCardClick,
}: FlashcardViewProps) => {
    const [hideTerm, setHideTerm] = useState(false);
    const [hideDef, setHideDef] = useState(false);
    return (
        <div >
            <div className="mb-5">
                <Text as="h2">
                    Flashcard({flashcards.length})
                </Text>
            </div>
            <div className="flex justify-center items-center mb-5 ">
                <button className="px-4 py-2 bg-purple-500 text-white rounded-md mr-2"
                onClick={() => setHideTerm(!hideTerm)}
                >
                    {hideTerm ? "Show Term" : "Hide Term"}
                </button>
                <button
                className="px-4 py-2 bg-pink-400 text-white rounded-md"
                onClick={() => setHideDef(!hideDef)}
                >
                    {hideDef ? "Show Definition" : "Hide Definition"}
                </button>
            </div>
           
            <div className="space-y-3 ">
                {flashcards.map((flashcard, index) => (
                    <Card
                     key={flashcard.id}
                     className={cn(
                        "w-full cursor-pointer transition-all hover:shadow-lg ",
                        currentIndex === index && "ring-4 ring-purple-400"
                     )}
                     onClick={() => onCardClick?.(index)}
                     >

                     <div className="flex items-start gap-4 p-4">
                        <div
                            className={cn(
                                "flex h-10 w-10 items-center justify-center",
                                currentIndex === index? "bg-purple-400": "bg-pink-300 "
                            )}
                            >
                                {index + 1}
                        </div>
                            {/*FOr Term and Definition */}
                            <div className="flex-1 space-y-4 min-h-[200px]  ">
                                <div>
                                    <Text className="mb-1 font-bold uppercase  text-lg">
                                        Term
                                    </Text>
                                    <Text className={cn(
                                        "text-2xl font-bold text-center transition",
                                        hideTerm && "blur-sm"
                                    )}  >
                                        {flashcard.term}
                                    </Text>
                                </div>
                                <div className="space-y-4 border-t-2  ">
                                    <Text className="mb-1 uppercase font-bold text-lg ">
                                        Definition
                                    </Text>
                                    <Text className={cn(
                                        "text-2xl font-bold text-center transition",
                                        hideDef && "blur-sm"
                                    )}>
                                        {flashcard.definition}
                                    </Text>

                                </div>

                            </div>
                     </div>
                    </Card>

                     
                    
                    )
                )}

            </div>
        </div>
    )
}

export default FlashcardView;