import {
  getPublicFlashcardSetsForUser,
  getPublicTopicsForUser,
  getUserById,
} from "@/lib/db";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;

      const user = await getUserById(userId);
      const publicTopics = await getPublicTopicsForUser(userId);
      const publicFlashcardSets = await getPublicFlashcardSetsForUser(userId);

      return {
        user,
        publicTopics,
        publicFlashcardSets,
      };
    }),
});
