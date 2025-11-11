import { api } from "@/trpc/server";
import PastLessonsPage from "./_components/past-lessons-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Lessons",
};

const Page = async () => {
  const topics = await api.lesson.getTopicsForUser();

  return <PastLessonsPage topics={topics} />;
};

export default Page;
