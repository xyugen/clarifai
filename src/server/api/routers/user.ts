import { getPublicTopicsForUser, getUserById } from "@/lib/db";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;

      const user = await getUserById(userId);
      const publicTopics = await getPublicTopicsForUser(userId);

      return {
        user,
        publicTopics,
      };
    }),
});
