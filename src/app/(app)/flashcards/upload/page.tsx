import { Text } from "@/components/retroui/Text";
import type { Metadata } from "next";
import FlashcardFileUploadArea from "./_components/flashcard-file-upload-area";

export const metadata: Metadata = {
  title: "Generate Flashcards",
};

const Page = () => {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl md:text-5xl">
          GENERATE{" "}
          <span className="bg-primary inline-block border-4 border-black px-3 py-1 shadow-lg">
            FLASHCARDS
          </span>
        </h1>
        <Text className="text-lg text-gray-700 md:text-xl">
          Drop your PDF and let <span className="font-bold">ClarifAI</span>{" "}
          extract key terms and concepts into flashcards.
        </Text>
      </div>

      <FlashcardFileUploadArea />
    </div>
  );
};

export default Page;
