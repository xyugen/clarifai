import { getSession } from "@/server/better-auth/server";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import FlashcardStudy from "./_components/flashcard-study";

type Props = {
  params: Promise<{ flashcardSetId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { flashcardSetId } = await params;

  try {
    const { flashcardSet } = await api.flashcard.getFlashcardSetPublic({
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
  const session = await getSession();
  const userId = session?.user?.id ?? null;

  const { flashcardSetId } = await params;
  const { flashcardSet, flashcards } =
    await api.flashcard.getFlashcardSetPublic({
      flashcardSetId,
    });

  return (
    <div className="min-h-screen bg-blue-100">
      <div className="mx-auto max-w-5xl px-2 py-4 sm:px-4 sm:py-8">
        <FlashcardStudy
          userId={userId}
          flashcardSet={flashcardSet}
          flashcards={flashcards}
        />
      </div>
    </div>
  );
};

export default Page;
