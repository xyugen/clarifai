import { Text } from "@/components/retroui/Text";
import { BookOpen } from "lucide-react";

export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex size-16 shrink-0 rotate-3 items-center justify-center border-2 border-black bg-pink-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <BookOpen className="size-8" />
          </div>
          <div className="flex-1">
            <Text as="h1" className="mb-2 text-4xl md:text-5xl">
              PAST LESSONS
            </Text>
            <Text as="p" className="text-lg text-gray-600">
              Review your learning journey and continue where you left off
            </Text>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
