"use client";

import { Button } from "@/components/retroui/Button";
import { Menu } from "@/components/retroui/Menu";
import { api } from "@/trpc/react";
import { Lock, Share2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface PrivacyButtonProps {
  topicId: string;
}

const PrivacyButton: React.FC<PrivacyButtonProps> = ({ topicId }) => {
  const topicVisibility = api.lesson.getTopicVisibility.useQuery({ topicId });

  const updateVisibilityMutation =
    api.lesson.updateTopicVisibility.useMutation();

  const handleChangeVisibility = async (
    newVisibility: "public" | "private",
  ) => {
    const toastId = toast.loading("Updating visibility...");
    try {
      await updateVisibilityMutation.mutateAsync({
        topicId,
        visibility: newVisibility,
      });

      toast.success("Visibility updated successfully!", { id: toastId });
      await topicVisibility.refetch();
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

  if (topicVisibility.isLoading) return null;

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
            <span className="capitalize">{topicVisibility.data}</span>
          </Button>
        </Menu.Trigger>
        <Menu.Content align="start" className="w-48">
          <Menu.Item
            onSelect={async () => {
              if (topicVisibility.data === "public") return;
              await handleChangeVisibility("public");
            }}
          >
            Make Public
          </Menu.Item>
          <Menu.Item
            onSelect={async () => {
              if (topicVisibility.data === "private") return;
              await handleChangeVisibility("private");
            }}
          >
            Make Private
          </Menu.Item>
        </Menu.Content>
      </Menu>
      {topicVisibility.data === "public" && (
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

export default PrivacyButton;
