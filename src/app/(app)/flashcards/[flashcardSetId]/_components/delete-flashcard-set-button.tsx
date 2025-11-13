"use client";

import { Button } from "@/components/retroui/Button";
import { Dialog } from "@/components/retroui/Dialog";
import { Text } from "@/components/retroui/Text";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { toast } from "sonner";

interface DeleteFlashcardSetButtonProps {
  flashcardSetId: string;
  redirectUrl?: string;
  showLabel?: boolean;
  className?: string;
}

const DeleteFlashcardSetButton: React.FC<DeleteFlashcardSetButtonProps> = ({
  flashcardSetId,
  redirectUrl,
  showLabel = false,
  className,
}) => {
  const router = useRouter();

  const deleteFlashcardSetMutation =
    api.flashcard.deleteFlashcardSet.useMutation();

  const { refetch } = api.flashcard.getFlashcardSetsForUser.useQuery();

  const handleDelete = async () => {
    try {
      toast.promise(
        deleteFlashcardSetMutation.mutateAsync({ flashcardSetId }),
        {
          loading: "Deleting flashcard set...",
          success: "Flashcard set deleted successfully",
          error: "Error deleting flashcard set",
        },
      );
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
      toast.error("Error deleting flashcard set");
    }
    await refetch();
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.refresh();
    }
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button
          variant={"default"}
          className={cn(
            "flex h-8 shrink-0 items-center justify-center gap-2 bg-red-300 hover:bg-red-400 focus:ring-red-200",
            className,
          )}
          size="sm"
        >
          <Trash className="size-4" strokeWidth={3} />
          {showLabel && <span>Delete</span>}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="bg-red-300">
          <Text as="h5">Delete this flashcard set?</Text>
        </Dialog.Header>
        <section className="flex flex-col gap-4 p-4">
          <section className="text-xl">
            <p>Are you sure you want to delete this flashcard set?</p>
            <p>This action cannot be undone.</p>
          </section>
          <section className="flex w-full justify-end gap-2">
            <Dialog.Trigger asChild>
              <Button variant={"outline"}>Cancel</Button>
            </Dialog.Trigger>
            <Dialog.Trigger asChild>
              <Button
                className="bg-red-300 hover:bg-red-400"
                onClick={handleDelete}
              >
                Confirm
              </Button>
            </Dialog.Trigger>
          </section>
        </section>
      </Dialog.Content>
    </Dialog>
  );
};

export default DeleteFlashcardSetButton;
