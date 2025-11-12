import { db } from "@/server/db";
import {
  topic as topicTable,
  user as userTable,
  question as questionTable,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq } from "drizzle-orm";

export const getUserById = async (userId: string) => {
  const [user] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      image: userTable.image,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1)
    .execute();

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return user;
};

export const getPublicTopicsForUser = async (userId: string) => {
  const topics = await db
    .select({
      id: topicTable.id,
      title: topicTable.title,
      summary: topicTable.summary,
      visibility: topicTable.visibility,
      createdAt: topicTable.createdAt,
    })
    .from(topicTable)
    .where(
      and(
        eq(topicTable.authorId, userId),
        eq(topicTable.visibility, "public")
      )
    )
    .orderBy(desc(topicTable.createdAt))
    .execute();

  // Get question count for each topic
  const topicsWithQuestionCount = await Promise.all(
    topics.map(async (topic) => {
      const [questionCountData] = await db
        .select({ questionCount: count(questionTable.id) })
        .from(questionTable)
        .where(eq(questionTable.topicId, topic.id))
        .execute();

      return {
        ...topic,
        questionCount: Number(questionCountData?.questionCount ?? 0),
      };
    })
  );

  return topicsWithQuestionCount;
};
