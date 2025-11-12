import { api } from "@/trpc/server";
import type { Metadata } from "next";
import ProfileHeader from "./_components/profile-header";
import PublicTopicsList from "./_components/public-topics-list";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  const { user } = await api.user.getUserProfile({ userId });

  return {
    title: `${user.name}'s Profile`,
  };
}

const Page = async ({ params }: Props) => {
  const { userId } = await params;
  const { user, publicTopics } = await api.user.getUserProfile({ userId });

  return (
    <div className="min-h-screen bg-cyan-100">
      <ProfileHeader user={user} topicCount={publicTopics.length} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <PublicTopicsList topics={publicTopics} userName={user.name} />
      </div>
    </div>
  );
};

export default Page;
