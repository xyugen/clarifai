import { LESSON_ID_LENGTH } from "@/constants/lesson";
import { db } from "@/server/db";
import {
  flashcard as flashcardTable,
  flashcardSet as flashcardSetTable,
  user as userTable,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const saveFlashcardSet = async ({
  title,
  summary,
  flashcards,
  authorId,
}: {
  title: string;
  summary: string;
  flashcards: { term: string; definition: string }[];
  authorId: string;
}) => {
  const [flashcardSet] = await db
    .insert(flashcardSetTable)
    .values({
      id: nanoid(LESSON_ID_LENGTH),
      title,
      summary,
      authorId: authorId,
    })
    .returning({ id: flashcardSetTable.id })
    .execute();

  if (!flashcardSet) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create flashcard set",
    });
  }

  const [flashcardId] = await db
    .insert(flashcardTable)
    .values(
      flashcards.map((fc) => ({
        id: nanoid(LESSON_ID_LENGTH),
        flashcardSetId: flashcardSet.id,
        term: fc.term,
        definition: fc.definition,
      })),
    )
    .returning({ id: flashcardTable.id })
    .execute();

  if (!flashcardId) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create flashcards",
    });
  }

  return flashcardSet.id;
};

export const getFlashcardSet = async (flashcardSetId: string) => {
  const [flashcardSet] = await db
    .select({
      id: flashcardSetTable.id,
      title: flashcardSetTable.title,
      authorId: flashcardSetTable.authorId,
      author: userTable.name,
      summary: flashcardSetTable.summary,
      visibility: flashcardSetTable.visibility,
      createdAt: flashcardSetTable.createdAt,
    })
    .from(flashcardSetTable)
    .leftJoin(userTable, eq(userTable.id, flashcardSetTable.authorId))
    .where(eq(flashcardSetTable.id, flashcardSetId))
    .limit(1)
    .execute();

  if (!flashcardSet) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Flashcard set not found",
    });
  }

  const flashcards = await db
    .select()
    .from(flashcardTable)
    .where(eq(flashcardTable.flashcardSetId, flashcardSet.id))
    .execute();

  return {
    flashcardSet,
    flashcards,
  };
};

export const getFlashcardSetsForUser = async (userId: string) => {
  const flashcardSets = await db
    .select({
      id: flashcardSetTable.id,
      title: flashcardSetTable.title,
      summary: flashcardSetTable.summary,
      visibility: flashcardSetTable.visibility,
      createdAt: flashcardSetTable.createdAt,
    })
    .from(flashcardSetTable)
    .where(eq(flashcardSetTable.authorId, userId))
    .orderBy(desc(flashcardSetTable.createdAt))
    .execute();

  const flashcardSetsWithCount = await Promise.all(
    flashcardSets.map(async (set) => {
      const [flashcardCountData] = await db
        .select({ flashcardCount: count(flashcardTable.id) })
        .from(flashcardTable)
        .where(eq(flashcardTable.flashcardSetId, set.id))
        .execute();

      const flashcardCount = Number(flashcardCountData?.flashcardCount ?? 0);

      return {
        ...set,
        flashcardCount,
      };
    }),
  );

  return flashcardSetsWithCount;
};

export const deleteFlashcardSetById = async (
  userId: string,
  flashcardSetId: string,
) => {
  try {
    const res = await db
      .delete(flashcardSetTable)
      .where(
        and(
          eq(flashcardSetTable.id, flashcardSetId),
          eq(flashcardSetTable.authorId, userId),
        ),
      );

    if (res.rowsAffected === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Flashcard set not found or unauthorized",
      });
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Error deleting flashcard set: " +
        (error instanceof Error ? error.message : String(error)),
    });
  }
};

export const updateFlashcardSetVisibility = async (
  flashcardSetId: string,
  visibility: "public" | "private",
) => {
  const res = await db
    .update(flashcardSetTable)
    .set({ visibility })
    .where(eq(flashcardSetTable.id, flashcardSetId));

  if (res.rowsAffected === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Flashcard set not found or unauthorized",
    });
  }
};

export const getPublicFlashcardSetsForUser = async (userId: string) => {
  const flashcardSets = await db
    .select({
      id: flashcardSetTable.id,
      title: flashcardSetTable.title,
      summary: flashcardSetTable.summary,
      visibility: flashcardSetTable.visibility,
      createdAt: flashcardSetTable.createdAt,
    })
    .from(flashcardSetTable)
    .where(
      and(
        eq(flashcardSetTable.authorId, userId),
        eq(flashcardSetTable.visibility, "public"),
      ),
    )
    .orderBy(desc(flashcardSetTable.createdAt))
    .execute();

  const flashcardSetsWithCount = await Promise.all(
    flashcardSets.map(async (set) => {
      const [flashcardCountData] = await db
        .select({ flashcardCount: count(flashcardTable.id) })
        .from(flashcardTable)
        .where(eq(flashcardTable.flashcardSetId, set.id))
        .execute();

      const flashcardCount = Number(flashcardCountData?.flashcardCount ?? 0);

      return {
        ...set,
        flashcardCount,
      };
    }),
  );

  return flashcardSetsWithCount;
};
