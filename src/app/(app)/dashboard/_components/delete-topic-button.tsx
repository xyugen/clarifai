"use client";

import { Button } from "@/components/retroui/Button";
import { Dialog } from "@/components/retroui/Dialog";
import { Text } from "@/components/retroui/Text";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { toast } from "sonner";

interface DeleteTopicButtonProps {
  topicId: string;
}

const DeleteTopicButton: React.FC<DeleteTopicButtonProps> = ({ topicId }) => {
  const router = useRouter();

  const deleteTopicMutation = api.lesson.deleteTopic.useMutation();

  const { refetch } = api.lesson.getTopicsForUserWithLimit.useQuery({
    limit: 6,
  });

  const handleDelete = async () => {
    try {
      toast.promise(deleteTopicMutation.mutateAsync({ topicId }), {
        loading: "Deleting topic...",
        success: "Topic deleted successfully",
        error: "Error deleting topic",
      });
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Error deleting topic");
    }
    await refetch();
    router.refresh();
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button
          variant={"default"}
          className="h-8 bg-red-300 hover:bg-red-400 focus:ring-red-200"
          size="sm"
        >
          <Trash className="size-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="bg-red-300">
          <Text as="h5">Delete this topic?</Text>
        </Dialog.Header>
        <section className="flex flex-col gap-4 p-4">
          <section className="text-xl">
            <p>Are you sure you want to delete this topic?</p>
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

export default DeleteTopicButton;
