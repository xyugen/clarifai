import {
  deleteFlashcardSetById,
  getFlashcardSet,
  getFlashcardSetsForUser,
  updateFlashcard,
  updateFlashcardSet,
  updateFlashcardSetVisibility,
} from "@/lib/db";
import {
  CachePrefix,
  CacheTTL,
  deleteCached,
  deleteCachedByPattern,
  getCached,
  setCached,
} from "@/lib/redis/cache";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const flashcardRouter = createTRPCRouter({
  getFlashcardSetPublic: publicProcedure
    .input(
      z.object({
        flashcardSetId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { flashcardSetId } = input;
      const userId = ctx.session?.user?.id;

      // Try to get from cache first
      const cacheKey = `${CachePrefix.LESSON}flashcard:${flashcardSetId}`;
      const cached = await getCached<{
        flashcardSet: Awaited<ReturnType<typeof getFlashcardSet>>["flashcardSet"];
        flashcards: Awaited<ReturnType<typeof getFlashcardSet>>["flashcards"];
      }>(cacheKey);

      if (cached) {
        // Check authorization for cached data
        if (cached.flashcardSet.visibility === "private") {
          // Private flashcard sets require authentication and ownership
          if (!userId || cached.flashcardSet.authorId !== userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Unauthorized access to flashcard set",
            });
          }
        }
        return cached;
      }

      // If not in cache, fetch from database
      const { flashcardSet, flashcards } =
        await getFlashcardSet(flashcardSetId);

      // Check authorization
      if (flashcardSet.visibility === "private") {
        // Private flashcard sets require authentication and ownership
        if (!userId || flashcardSet.authorId !== userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized access to flashcard set",
          });
        }
      }

      // Cache the result
      await setCached(
        cacheKey,
        { flashcardSet, flashcards },
        CacheTTL.LESSON,
      );

      return { flashcardSet, flashcards };
    }),

  getFlashcardSet: protectedProcedure
    .input(
      z.object({
        flashcardSetId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { flashcardSetId } = input;
      const {
        session: { user },
      } = ctx;

      // Try to get from cache first
      const cacheKey = `${CachePrefix.LESSON}flashcard:${flashcardSetId}`;
      const cached = await getCached<{
        flashcardSet: Awaited<ReturnType<typeof getFlashcardSet>>["flashcardSet"];
        flashcards: Awaited<ReturnType<typeof getFlashcardSet>>["flashcards"];
      }>(cacheKey);

      if (cached) {
        // Check authorization for cached data
        if (
          cached.flashcardSet.authorId !== user.id &&
          cached.flashcardSet.visibility === "private"
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized access to flashcard set",
          });
        }
        return cached;
      }

      // If not in cache, fetch from database
      const { flashcardSet, flashcards } =
        await getFlashcardSet(flashcardSetId);

      if (
        flashcardSet.authorId !== user.id &&
        flashcardSet.visibility === "private"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to flashcard set",
        });
      }

      // Cache the result
      await setCached(
        cacheKey,
        { flashcardSet, flashcards },
        CacheTTL.LESSON,
      );

      return { flashcardSet, flashcards };
    }),

  getFlashcardSetsForUser: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: { user },
    } = ctx;

    if (!user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    // Try to get from cache first
    const cacheKey = `${CachePrefix.USER_TOPICS}flashcard:${user.id}:all`;
    const cached = await getCached<
      Awaited<ReturnType<typeof getFlashcardSetsForUser>>
    >(cacheKey);

    if (cached) {
      return cached;
    }

    // If not in cache, fetch from database
    const flashcardSets = await getFlashcardSetsForUser(user.id);

    if (!flashcardSets) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Flashcard sets not found",
      });
    }

    // Cache the result
    await setCached(cacheKey, flashcardSets, CacheTTL.LESSON);

    return flashcardSets;
  }),

  deleteFlashcardSet: protectedProcedure
    .input(
      z.object({
        flashcardSetId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { flashcardSetId } = input;
      const {
        session: { user },
      } = ctx;

      await deleteFlashcardSetById(user.id, flashcardSetId);

      // Invalidate related caches
      await Promise.all([
        deleteCached(`${CachePrefix.LESSON}flashcard:${flashcardSetId}`),
        deleteCachedByPattern(
          `${CachePrefix.USER_TOPICS}flashcard:${user.id}:*`,
        ),
      ]);
    }),

  getFlashcardSetVisibility: protectedProcedure
    .input(
      z.object({
        flashcardSetId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { flashcardSetId } = input;
      const {
        session: { user },
      } = ctx;

      const { flashcardSet } = await getFlashcardSet(flashcardSetId);

      if (flashcardSet.authorId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to flashcard set",
        });
      }

      return flashcardSet.visibility;
    }),

  updateFlashcardSetVisibility: protectedProcedure
    .input(
      z.object({
        flashcardSetId: z.string(),
        visibility: z.enum(["public", "private"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { flashcardSetId, visibility } = input;
      const {
        session: { user },
      } = ctx;

      const { flashcardSet } = await getFlashcardSet(flashcardSetId);

      if (flashcardSet.authorId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to flashcard set",
        });
      }

      await updateFlashcardSetVisibility(flashcardSetId, visibility);

      // Invalidate related caches
      await Promise.all([
        deleteCached(`${CachePrefix.LESSON}flashcard:${flashcardSetId}`),
        deleteCachedByPattern(
          `${CachePrefix.USER_TOPICS}flashcard:${user.id}:*`,
        ),
      ]);
    }),

  updateFlashcardSetInfo: protectedProcedure
    .input(
      z.object({
        flashcardSetId: z.string(),
        title: z.string().min(1).optional(),
        summary: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { flashcardSetId, title, summary } = input;
      const {
        session: { user },
      } = ctx;

      const { flashcardSet } = await getFlashcardSet(flashcardSetId);

      if (flashcardSet.authorId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to flashcard set",
        });
      }

      const updateData: { title?: string; summary?: string } = {};
      if (title !== undefined) updateData.title = title;
      if (summary !== undefined) updateData.summary = summary;

      await updateFlashcardSet(flashcardSetId, updateData);

      // Invalidate related caches
      await Promise.all([
        deleteCached(`${CachePrefix.LESSON}flashcard:${flashcardSetId}`),
        deleteCachedByPattern(
          `${CachePrefix.USER_TOPICS}flashcard:${user.id}:*`,
        ),
      ]);
    }),

  updateFlashcardContent: protectedProcedure
    .input(
      z.object({
        flashcardId: z.string(),
        flashcardSetId: z.string(),
        term: z.string().min(1).optional(),
        definition: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { flashcardId, flashcardSetId, term, definition } = input;
      const {
        session: { user },
      } = ctx;

      const { flashcardSet } = await getFlashcardSet(flashcardSetId);

      if (flashcardSet.authorId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to flashcard",
        });
      }

      const updateData: { term?: string; definition?: string } = {};
      if (term !== undefined) updateData.term = term;
      if (definition !== undefined) updateData.definition = definition;

      await updateFlashcard(flashcardId, updateData);

      // Invalidate related caches
      await Promise.all([
        deleteCached(`${CachePrefix.LESSON}flashcard:${flashcardSetId}`),
        deleteCachedByPattern(
          `${CachePrefix.USER_TOPICS}flashcard:${user.id}:*`,
        ),
      ]);
    }),
});
