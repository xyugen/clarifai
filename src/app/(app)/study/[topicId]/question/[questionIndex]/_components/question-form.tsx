"use client";

import { Button } from "@/components/retroui/Button";
import { Label } from "@/components/retroui/Label";
import { Loader } from "@/components/retroui/Loader";
import { Textarea } from "@/components/retroui/Textarea";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { formSchema, MAX_ANSWER_LENGTH } from "./schema";

interface QuestionFormProps {
  questionId: string;
  currentQuestionIndex: number;
  isLastQuestion?: boolean;
  latestAnswer?: string | null;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionId,
  currentQuestionIndex,
  isLastQuestion,
  latestAnswer,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isAnswered, setIsAnswered] = useState<boolean>(!!latestAnswer);

  const generateFeedbackMutation =
    api.ai.generateFeedbackFromAnswer.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: latestAnswer ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { answer } = data;

    generateFeedbackMutation.mutate(
      {
        questionId,
        userAnswer: answer,
      },
      {
        onSuccess: (data) => {
          setIsAnswered(true);
          // const basePath = pathname.substring(0, pathname.lastIndexOf("/")); // removes the last "/2"
          // const nextIndex = currentQuestionIndex + 1;
          // router.push(`${basePath}/${nextIndex}`);
        },
        onError: (error) => {
          console.error("Error generating feedback:", error);
          toast.error(
            error.data?.code === "BAD_REQUEST"
              ? error.message
              : "An error occurred while submitting your answer.",
          );
        },
      },
    );
  };

  const handleSkipQuestion = () => {
    const basePath = pathname.substring(0, pathname.lastIndexOf("/")); // removes the last "/2"
    const nextIndex = currentQuestionIndex + 1;
    router.push(`${basePath}/${nextIndex}`);
  };

  return (
    <form
      id="form-question"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Answer Input */}
      <FieldGroup>
        <Controller
          name="answer"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label className="flex items-center gap-2 text-sm uppercase">
                <Sparkles className="size-4" />
                Your Answer
              </Label>
              <Textarea
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="Take your time to think through your answer..."
                className="focus:ring-primary h-64 w-full resize-none border-2 border-black p-4 text-lg font-medium focus:ring-4 focus:outline-none"
                maxLength={MAX_ANSWER_LENGTH}
                required
              />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {field.value.length} / {MAX_ANSWER_LENGTH} characters
                </span>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      {/* Action Buttons */}
      <FieldGroup className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          form="form-question"
          variant={"default"}
          disabled={generateFeedbackMutation.isPending}
          className={cn(
            "relative flex flex-1 items-center justify-center gap-2",
            isAnswered ? "bg-green-300 hover:bg-green-400" : "bg-primary",
          )}
        >
          {generateFeedbackMutation.isPending && (
            <div className="bg-background/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader />
            </div>
          )}
          <Send className="size-5" strokeWidth={3} />
          {isAnswered ? "UPDATE ANSWER" : "SUBMIT ANSWER"}
        </Button>
        {!isLastQuestion && (
          <Button
            type="button"
            variant={"outline"}
            disabled={generateFeedbackMutation.isPending}
            onClick={handleSkipQuestion}
            className="flex items-center justify-center"
          >
            {isAnswered ? "NEXT" : "SKIP FOR NOW"}
          </Button>
        )}
      </FieldGroup>
    </form>
  );
};

export default QuestionForm;
