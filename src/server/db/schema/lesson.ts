import { TOPIC_VISIBILITY } from "@/constants/lesson";
import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
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
  answeredAt: integer("answeredAt", { mode: "timestamp" }),
});

export const answer = createTable("answer", {
  id: text("id").primaryKey(),
  questionId: text("questionId")
    .notNull()
    .references(() => question.id, { onDelete: "cascade" }),
  userAnswer: text("userAnswer").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const feedback = createTable("feedback", {
  id: text("id").primaryKey(),
  answerId: text("answerId")
    .notNull()
    .references(() => answer.id, { onDelete: "cascade" }),
  clarityScore: integer("clarityScore").notNull(),
  summary: text("summary").notNull(),
  feedback: text("feedback").notNull(),
  encouragement: text("encouragement"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const keyPointsMissed = createTable("key_points_missed", {
  id: text("id").primaryKey(),
  feedbackId: text("feedbackId")
    .notNull()
    .references(() => feedback.id, { onDelete: "cascade" }),
  point: text("point").notNull(),
});

export const suggestions = createTable("suggestions", {
  id: text("id").primaryKey(),
  feedbackId: text("feedbackId")
    .notNull()
    .references(() => feedback.id, { onDelete: "cascade" }),
  suggestion: text("suggestion").notNull(),
});

export type Topic = InferSelectModel<typeof topic>;
export type Question = InferSelectModel<typeof question>;
export type Answer = InferSelectModel<typeof answer>;
export type Feedback = InferSelectModel<typeof feedback>;
export type KeyPointMissed = InferSelectModel<typeof keyPointsMissed>;
export type Suggestion = InferSelectModel<typeof suggestions>;

export type InsertAnswer = InferInsertModel<typeof answer>;
export type InsertFeedback = InferInsertModel<typeof feedback>;
