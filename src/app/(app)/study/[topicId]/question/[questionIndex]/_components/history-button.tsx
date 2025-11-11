"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Dialog } from "@/components/retroui/Dialog";
import { Text } from "@/components/retroui/Text";
import { TextLink } from "@/components/retroui/TextLink";
import { api } from "@/trpc/react";
import { formatDate } from "date-fns";
import { ChevronRight, Clock, FileText, History, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

interface HistoryButtonProps {
  questionId: string;
  questionText: string;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({
  questionId,
  questionText,
}) => {
  const pathname = usePathname();
  const answersQuery = api.lesson.getQuestionAnswersFromUser.useQuery({
    questionId,
  });

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-background flex items-center gap-2 font-sans"
        >
          <History className="size-4" />
          VIEW HISTORY
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="lg">
        <Dialog.Header className="border-b-2 border-black bg-blue-300 p-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="mb-2 inline-block border-2 border-black bg-white px-2 py-1 text-xs">
                ANSWER HISTORY
              </div>
              <Text as="h5" className="text-xl leading-tight">
                {questionText}
              </Text>
            </div>
          </div>
        </Dialog.Header>

        <section className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">
          {answersQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-3 h-8 w-8 animate-spin" strokeWidth={3} />
              <Text as="p" className="font-bold text-gray-600">
                Loading your answers...
              </Text>
            </div>
          ) : answersQuery.data && answersQuery.data.length > 0 ? (
            <div className="space-y-3">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="size-4" />
                <Text as="p" className="text-sm text-gray-600">
                  {answersQuery.data.length}{" "}
                  {answersQuery.data.length === 1 ? "attempt" : "attempts"}
                </Text>
              </div>

              {answersQuery.data
                .slice()
                .reverse()
                .map((answer, index) => (
                  <TextLink
                    key={answer.id}
                    href={`${pathname}/${answer.id}`}
                    className="group block"
                  >
                    <Card className="w-full border-2 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center border-2 border-black bg-pink-300 text-xs">
                            {answersQuery.data.length - index}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="size-3.5" />
                            {formatDate(
                              answer.createdAt,
                              "MMM dd, yyyy hh:mm a",
                            )}
                          </div>
                        </div>
                        <ChevronRight className="size-5 shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-black" />
                      </div>

                      <Text
                        as="p"
                        className="text-sm leading-relaxed text-gray-700"
                      >
                        {truncateText(answer.userAnswer)}
                      </Text>
                    </Card>
                  </TextLink>
                ))}
            </div>
          ) : (
            <Card className="w-full border-2 bg-purple-50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-black bg-purple-300">
                <History className="size-8" />
              </div>
              <Text as="p" className="mb-2 text-gray-700">
                No previous answers yet
              </Text>
              <Text as="p" className="text-sm text-gray-600">
                Submit your first answer to start tracking your progress!
              </Text>
            </Card>
          )}
        </section>
        <Dialog.Footer>
          <Dialog.Trigger asChild>
            <Button variant="outline" className="bg-background">
              CLOSE
            </Button>
          </Dialog.Trigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default HistoryButton;
