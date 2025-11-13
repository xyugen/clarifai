"use client";

import { Button } from "@/components/retroui/Button";
import { Menu } from "@/components/retroui/Menu";
import { api } from "@/trpc/react";
import { Lock, Share2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface FlashcardPrivacyButtonProps {
  flashcardSetId: string;
}

const FlashcardPrivacyButton: React.FC<FlashcardPrivacyButtonProps> = ({
  flashcardSetId,
}) => {
  const flashcardSetVisibility =
    api.flashcard.getFlashcardSetVisibility.useQuery({ flashcardSetId });

  const updateVisibilityMutation =
    api.flashcard.updateFlashcardSetVisibility.useMutation();

  const handleChangeVisibility = async (
    newVisibility: "public" | "private",
  ) => {
    const toastId = toast.loading("Updating visibility...");
    try {
      await updateVisibilityMutation.mutateAsync({
        flashcardSetId,
        visibility: newVisibility,
      });

      toast.success("Visibility updated successfully!", { id: toastId });
      await flashcardSetVisibility.refetch();
    } catch (error) {
      toast.error(
        `Error updating visibility: ${
          error instanceof Error ? error.message : "Unexpected error"
        }`,
        { id: toastId },
      );
      console.error(error);
    }
  };

  const handleShareClick = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy link");
    }
  };

  if (flashcardSetVisibility.isLoading) return null;

  return (
    <>
      <Menu>
        <Menu.Trigger asChild>
          <Button
            size={"sm"}
            variant={"outline"}
            className="bg-background flex items-center gap-2"
            disabled={updateVisibilityMutation.isPending}
          >
            <Lock className="size-4" strokeWidth={3} />
            <span className="capitalize">{flashcardSetVisibility.data}</span>
          </Button>
        </Menu.Trigger>
        <Menu.Content align="start" className="w-48">
          <Menu.Item
            onSelect={async () => {
              if (flashcardSetVisibility.data === "public") return;
              await handleChangeVisibility("public");
            }}
          >
            Make Public
          </Menu.Item>
          <Menu.Item
            onSelect={async () => {
              if (flashcardSetVisibility.data === "private") return;
              await handleChangeVisibility("private");
            }}
          >
            Make Private
          </Menu.Item>
        </Menu.Content>
      </Menu>
      {flashcardSetVisibility.data === "public" && (
        <button
          className="ml-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:cursor-pointer"
          onClick={handleShareClick}
        >
          <Share2 className="size-6" />
        </button>
      )}
    </>
  );
};

export default FlashcardPrivacyButton;
