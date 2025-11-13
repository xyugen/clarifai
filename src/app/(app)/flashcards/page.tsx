import { Button } from "@/components/retroui/Button";
import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { api } from "@/trpc/server";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import FlashcardSetsList from "./_components/flashcard-sets-list";

export const metadata: Metadata = {
  title: "My Flashcards",
};

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  const flashcardSets = await api.flashcard.getFlashcardSetsForUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 to-pink-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">MY FLASHCARDS</h1>
            <p className="mt-2 text-gray-600">
              Review and study your flashcard sets
            </p>
          </div>
          <Link href={PageRoutes.DASHBOARD}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          </Link>
        </div>

        <FlashcardSetsList flashcardSets={flashcardSets} />
      </div>
    </div>
  );
};

export default Page;
