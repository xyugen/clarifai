import { TOPIC_VISIBILITY } from "@/constants/lesson";
import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { createTable } from "../table";
import { user } from "./auth";

export const topic = createTable(
  "topic",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    authorId: text("authorId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    summary: text("summary"),
    visibility: text("visibility", { enum: TOPIC_VISIBILITY })
      .notNull()
      .default("private"),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    authorIdIdx: index("topic_author_id_idx").on(table.authorId),
    createdAtIdx: index("topic_created_at_idx").on(table.createdAt),
  }),
);

export const question = createTable(
  "question",
  {
    id: text("id").primaryKey(),
    topicId: text("topicId")
      .notNull()
      .references(() => topic.id, { onDelete: "cascade" }),
    text: text("questionText").notNull(),
    referenceAnswer: text("referenceAnswer").notNull(),
    answeredAt: integer("answeredAt", { mode: "timestamp" }),
  },
  (table) => ({
    topicIdIdx: index("question_topic_id_idx").on(table.topicId),
  }),
);

export const answer = createTable(
  "answer",
  {
    id: text("id").primaryKey(),
    questionId: text("questionId")
      .notNull()
      .references(() => question.id, { onDelete: "cascade" }),
    authorId: text("authorId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    userAnswer: text("userAnswer").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    questionIdIdx: index("answer_question_id_idx").on(table.questionId),
    authorIdIdx: index("answer_author_id_idx").on(table.authorId),
    questionAuthorIdx: index("answer_question_author_idx").on(
      table.questionId,
      table.authorId,
    ),
  }),
);

export const feedback = createTable(
  "feedback",
  {
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
  },
  (table) => ({
    answerIdIdx: index("feedback_answer_id_idx").on(table.answerId),
  }),
);

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

export const flashcardSet = createTable("flashcard_set", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  authorId: text("authorId")
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

export const flashcard = createTable("flashcard", {
  id: text("id").primaryKey(),
  flashcardSetId: text("flashcardSetId")
    .notNull()
    .references(() => flashcardSet.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
});

export type Topic = InferSelectModel<typeof topic>;
export type Question = InferSelectModel<typeof question>;
export type Answer = InferSelectModel<typeof answer>;
export type Feedback = InferSelectModel<typeof feedback>;
export type KeyPointMissed = InferSelectModel<typeof keyPointsMissed>;
export type Suggestion = InferSelectModel<typeof suggestions>;
export type FlashcardSet = InferSelectModel<typeof flashcardSet>;
export type Flashcard = InferSelectModel<typeof flashcard>;

export type InsertAnswer = InferInsertModel<typeof answer>;
export type InsertFeedback = InferInsertModel<typeof feedback>;
export type InsertFlashcardSet = InferInsertModel<typeof flashcardSet>;
export type InsertFlashcard = InferInsertModel<typeof flashcard>;
