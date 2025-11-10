export const TOPIC_VISIBILITY = ["private", "public"] as const;
export type TopicVisibility = (typeof TOPIC_VISIBILITY)[number];