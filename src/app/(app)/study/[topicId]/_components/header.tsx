import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { BookOpen, Clock, MessageSquare, User } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  author: string | null;
  createdAt: Date;
  questionCount: number;
}

const Header: React.FC<HeaderProps> = ({
  title,
  author,
  createdAt,
  questionCount,
}: HeaderProps) => {
  return (
    <div className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-start gap-4">
          <Card className="border-foreground bg-primary flex size-16 shrink-0 rotate-3 items-center justify-center border-2 hover:shadow-md">
            <BookOpen className="size-8" />
          </Card>
          <div className="flex-1">
            <Card className="border-foreground mb-3 inline-block -rotate-1 border-2 bg-pink-400 px-3 py-1 shadow hover:shadow">
              <span className="text-xs font-bold">LESSON OVERVIEW</span>
            </Card>
            <Text
              as="h1"
              className="mb-3 text-3xl leading-tight font-black md:text-5xl"
            >
              {title}
            </Text>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="size-4" strokeWidth={3} />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" strokeWidth={3} />
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4" strokeWidth={3} />
                <span>{questionCount} Questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
