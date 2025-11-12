export const LESSON_ID_LENGTH = 8;

export const TOPIC_VISIBILITY = ["private", "public"] as const;
export type TopicVisibility = (typeof TOPIC_VISIBILITY)[number];
