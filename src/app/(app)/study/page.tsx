import { api } from "@/trpc/server";
import PastLessonsPage from "./_components/past-lessons-page";

const Page = async () => {
  const topics = await api.lesson.getTopicsForUser();

  return <PastLessonsPage topics={topics} />;
};

export default Page;
