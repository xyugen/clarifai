import { Button } from "@/components/retroui/Button";
import { PageRoutes } from "@/constants/page-routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface TopNavProps {
  topicId: string;
  totalQuestions: number;
  currentQuestionIndex: number;
}

const TopNav: React.FC<TopNavProps> = ({
  topicId,
  totalQuestions,
  currentQuestionIndex,
}) => {
  return (
    <div className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${topicId}`}>
            <Button
              variant={"outline"}
              className="bg-bg-background hover:bg-foreground/1 flex items-center gap-2 px-4 py-2"
            >
              <ArrowLeft className="size-4" strokeWidth={3} />
              BACK
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <Link
                key={i}
                href={`/${topicId}/question/${i + 1}`}
                className={`flex h-8 w-8 items-center justify-center border-2 border-black text-sm font-bold ${
                  i + 1 === currentQuestionIndex
                    ? "bg-primary"
                    : "bg-background hover:bg-foreground/5"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
