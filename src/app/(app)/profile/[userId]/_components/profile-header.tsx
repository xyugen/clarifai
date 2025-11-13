import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { formatDate } from "date-fns";
import { BookOpen, Calendar, CreditCard } from "lucide-react";
import Image from "next/image";
import React from "react";
import ShareButton from "./share-button";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
  };
  topicCount: number;
  flashcardCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  topicCount,
  flashcardCount,
}: ProfileHeaderProps) => {
  return (
    <div className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-start gap-6">
          <div className="bg-primary border-primary flex size-32 shrink-0 items-center justify-center overflow-hidden border-4 shadow-md">
            {user.image ? (
              <Image
                src={user.image ?? undefined}
                alt="Profile"
                width={128}
                height={128}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-6xl">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="mb-3 flex w-fit flex-row items-center justify-center gap-3">
              <Card className="border-foreground bg-primary inline-block border-2 px-3 py-1 shadow hover:shadow">
                <span className="text-xs font-bold">USER PROFILE</span>
              </Card>
              <ShareButton />
            </div>
            <Text
              as="h1"
              className="mb-3 text-3xl leading-tight font-black md:text-5xl"
            >
              {user.name}
            </Text>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>Joined {formatDate(user.createdAt, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="size-4" />
                <span>{topicCount} Public Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="size-4" />
                <span>{flashcardCount} Public Flashcard Sets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
