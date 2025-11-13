import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { api } from "@/trpc/server";
import { ArrowLeft, CreditCard, Plus, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-cyan-100">
      {/* Header Section */}
      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex flex-1 items-start gap-4">
              <div className="flex size-14 shrink-0 rotate-3 items-center justify-center border-2 border-black bg-purple-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:size-16">
                <CreditCard className="size-7 sm:size-8" />
              </div>
              <div className="flex-1">
                <div className="mb-3 flex flex-row items-start justify-between">
                  <div className="inline-block -rotate-1 border-2 border-black bg-pink-400 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-xs">STUDY TOOLS</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Link href={PageRoutes.DASHBOARD}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-background"
                      >
                        <ArrowLeft className="mr-2 size-4" strokeWidth={3} />
                        BACK
                      </Button>
                    </Link>
                  </div>
                </div>
                <Text
                  as="h1"
                  className="mb-2 text-3xl wrap-break-word sm:text-4xl md:text-5xl"
                >
                  MY FLASHCARDS
                </Text>
                <Text as="p" className="text-lg text-gray-600">
                  Review and master your flashcard sets
                </Text>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          {flashcardSets.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card className="border-2 bg-yellow-300 p-4 text-center">
                <Text as="p" className="mb-1 text-3xl">
                  {flashcardSets.length}
                </Text>
                <Text as="p" className="text-xs uppercase">
                  Total Sets
                </Text>
              </Card>
              <Card className="border-2 bg-blue-300 p-4 text-center">
                <Text as="p" className="mb-1 text-3xl">
                  {flashcardSets.reduce(
                    (sum, set) => sum + set.flashcardCount,
                    0,
                  )}
                </Text>
                <Text as="p" className="text-xs uppercase">
                  Total Cards
                </Text>
              </Card>
              <Card className="border-2 bg-green-300 p-4 text-center">
                <Text as="p" className="mb-1 text-3xl">
                  {
                    flashcardSets.filter((set) => set.visibility === "public")
                      .length
                  }
                </Text>
                <Text as="p" className="text-xs uppercase">
                  Public
                </Text>
              </Card>
              <Card className="border-2 bg-pink-300 p-4 text-center">
                <Text as="p" className="mb-1 text-3xl">
                  {
                    flashcardSets.filter((set) => set.visibility === "private")
                      .length
                  }
                </Text>
                <Text as="p" className="text-xs uppercase">
                  Private
                </Text>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {flashcardSets.length === 0 ? (
          <Card className="w-full border-2 bg-white p-8 text-center sm:p-12 md:p-16">
            <Text as="h2" className="mb-3 text-xl sm:text-3xl">
              NO FLASHCARDS YET
            </Text>
            <Text
              as="p"
              className="mx-auto mb-8 max-w-md text-[1.1rem] text-gray-600 sm:text-lg"
            >
              Create your first flashcard set to start studying smarter!
            </Text>
            <Link href={`${PageRoutes.FLASHCARDS}/upload`}>
              <Button
                variant="default"
                size="lg"
                className="mx-auto flex items-center gap-2"
              >
                <Plus className="h-5 w-5" strokeWidth={3} />
                CREATE YOUR FIRST SET
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Quick Action Banner */}
            <Card className="mb-6 w-full border-2 bg-purple-300 p-6">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <div className="bg-primary flex size-10 shrink-0 items-center justify-center border-2 border-black">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <Text as="h3" className="mb-1 text-xl">
                      READY TO STUDY?
                    </Text>
                    <Text as="p" className="text-gray-800">
                      Pick a set below or create a new one to get started
                    </Text>
                  </div>
                </div>
                <Link href={`${PageRoutes.FLASHCARDS}/upload`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" strokeWidth={3} />
                    NEW SET
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Flashcard Sets List */}
            <FlashcardSetsList flashcardSets={flashcardSets} />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
