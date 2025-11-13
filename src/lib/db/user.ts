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
  const topicsWithQuestionCount = await db
    .select({
      id: topicTable.id,
      title: topicTable.title,
      summary: topicTable.summary,
      visibility: topicTable.visibility,
      createdAt: topicTable.createdAt,
      questionCount: count(questionTable.id),
    })
    .from(topicTable)
    .leftJoin(questionTable, eq(questionTable.topicId, topicTable.id))
    .where(
      and(eq(topicTable.authorId, userId), eq(topicTable.visibility, "public")),
    )
    .groupBy(
      topicTable.id,
      topicTable.title,
      topicTable.summary,
      topicTable.visibility,
      topicTable.createdAt,
    )
    .orderBy(desc(topicTable.createdAt))
    .execute();

  return topicsWithQuestionCount.map((topic) => ({
    ...topic,
    questionCount: Number(topic.questionCount ?? 0),
  }));
};
