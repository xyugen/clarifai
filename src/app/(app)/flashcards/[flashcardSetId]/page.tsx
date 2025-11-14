import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FlashcardStudy from "./_components/flashcard-study";

type Props = {
  params: Promise<{ flashcardSetId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { flashcardSetId } = await params;

  try {
    const { flashcardSet } = await api.flashcard.getFlashcardSet({
      flashcardSetId,
    });
    return {
      title: flashcardSet.title,
    };
  } catch (error) {
    return {
      title: "Flashcard Set Not Found",
    };
  }
}

const Page = async ({ params }: Props) => {
  const { flashcardSetId } = await params;
  const { flashcardSet, flashcards } = await api.flashcard.getFlashcardSet({
    flashcardSetId,
  });

  return (
    <div className="min-h-screen bg-blue-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <FlashcardStudy flashcardSet={flashcardSet} flashcards={flashcards} />
      </div>
    </div>
  );
};

export default Page;
