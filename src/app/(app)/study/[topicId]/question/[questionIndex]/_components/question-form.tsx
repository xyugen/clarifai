"use client";

import { Button } from "@/components/retroui/Button";
import { Label } from "@/components/retroui/Label";
import { Textarea } from "@/components/retroui/Textarea";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { formSchema, MAX_ANSWER_LENGTH } from "./schema";

interface QuestionFormProps {
  questionId: string;
  currentQuestionIndex: number;
  isLastQuestion?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionId,
  currentQuestionIndex,
  isLastQuestion,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const generateFeedbackMutation =
    api.ai.generateFeedbackFromAnswer.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
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
          // const basePath = pathname.substring(0, pathname.lastIndexOf("/")); // removes the last "/2"
          // const nextIndex = currentQuestionIndex + 1;
          // router.push(`${basePath}/${nextIndex}`);
        },
        onError: (error) => {
          console.error("Error generating feedback:", error);
          toast.error(
            error.message ?? "An error occurred while submitting your answer.",
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
                className="h-64 w-full resize-none border-2 border-black p-4 text-lg font-medium focus:ring-4 focus:ring-yellow-400 focus:outline-none"
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
          className="flex flex-1 items-center justify-center gap-2"
        >
          {generateFeedbackMutation.isPending ? (
            <LoaderCircle className="stroke-primary size-5 animate-spin" />
          ) : (
            <>
              <Send className="size-5" strokeWidth={3} />
              SUBMIT ANSWER
            </>
          )}
        </Button>
        {!isLastQuestion && (
          <Button
            type="button"
            variant={"outline"}
            disabled={generateFeedbackMutation.isPending}
            onClick={handleSkipQuestion}
          >
            SKIP FOR NOW
          </Button>
        )}
      </FieldGroup>
    </form>
  );
};

export default QuestionForm;
