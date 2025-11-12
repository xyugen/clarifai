import { Avatar } from "@/components/retroui/Avatar";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { formatDate } from "date-fns";
import { BookOpen, Calendar } from "lucide-react";
import React from "react";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
  };
  topicCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  topicCount,
}: ProfileHeaderProps) => {
  return (
    <div className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-start gap-6">
          <Card className="border-foreground bg-primary flex size-24 shrink-0 items-center justify-center overflow-hidden border-2 hover:shadow-md md:size-32">
            <Avatar className="size-full border-0">
              <Avatar.Image src={user.image ?? undefined} alt={user.name} />
              <Avatar.Fallback>{user.name[0]?.toUpperCase() || "U"}</Avatar.Fallback>
            </Avatar>
          </Card>
          <div className="flex-1">
            <Card className="border-foreground mb-3 inline-block -rotate-1 border-2 bg-yellow-300 px-3 py-1 shadow hover:shadow">
              <span className="text-xs font-bold">USER PROFILE</span>
            </Card>
            <Text
              as="h1"
              className="mb-3 text-3xl font-black leading-tight md:text-5xl"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
