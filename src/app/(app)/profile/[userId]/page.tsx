import { api } from "@/trpc/server";
import type { Metadata } from "next";
import ProfileContent from "./_components/profile-content";
import ProfileHeader from "./_components/profile-header";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  try {
    const { user } = await api.user.getUserProfile({ userId });
    return {
      title: `${user.name}'s Profile`,
    };
  } catch (error) {
    return {
      title: "User Not Found",
    };
  }
}

const Page = async ({ params }: Props) => {
  const { userId } = await params;
  const { user, publicTopics, publicFlashcardSets } =
    await api.user.getUserProfile({ userId });

  return (
    <div className="min-h-screen bg-cyan-100">
      <ProfileHeader
        user={user}
        topicCount={publicTopics.length}
        flashcardCount={publicFlashcardSets.length}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProfileContent
          userName={user.name}
          publicTopics={publicTopics}
          publicFlashcardSets={publicFlashcardSets}
        />
      </div>
    </div>
  );
};

export default Page;
