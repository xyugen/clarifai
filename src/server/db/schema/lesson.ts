import { TOPIC_VISIBILITY } from "@/constants/lesson";
import { sql, type InferSelectModel } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { createTable } from "../table";
import { user } from "./auth";

export const topic = createTable("topic", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  summary: text("summary"),
  visibility: text("visibility", { enum: TOPIC_VISIBILITY })
    .notNull()
    .default("private"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const question = createTable("question", {
  id: text("id").primaryKey(),
  topicId: text("topicId")
    .notNull()
    .references(() => topic.id, { onDelete: "cascade" }),
  text: text("questionText").notNull(),
  referenceAnswer: text("referenceAnswer").notNull(),
  userAnswer: text("userAnswer"),
  feedback: text("feedback"),
  clarityScore: integer("clarityScore"),
  answeredAt: integer("answeredAt", { mode: "timestamp" }),
});

export type Topic = InferSelectModel<typeof topic>;
export type Question = InferSelectModel<typeof question>;
