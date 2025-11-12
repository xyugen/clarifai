"use client";

import { Button } from "@/components/retroui/Button";
import { Dialog } from "@/components/retroui/Dialog";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";

const DeleteAccountButton = () => {
  const router = useRouter();

  const [confirmationText, setConfirmationText] = useState("");

  const handleDelete = async () => {
    try {
      await authClient.deleteUser();
      router.push(PageRoutes.SIGNUP);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account");
    }
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="rounded border border-red-400 bg-white px-4 py-2 text-red-600 hover:bg-red-50"
        >
          DELETE ACCOUNT
        </button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="bg-red-300">
          <Text as="h5">Delete your account?</Text>
        </Dialog.Header>
        <section className="flex flex-col gap-4 p-4">
          <section className="text-xl">
            <p>Are you sure you want to delete your account?</p>
            <p>
              If yes, type{" "}
              <span className="font-bold text-red-600">DELETE ACCOUNT</span>:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="mt-2 w-full rounded border p-2 text-base"
              placeholder="Type DELETE ACCOUNT to confirm"
            />
          </section>
          <section className="flex w-full justify-end gap-2">
            <Dialog.Trigger asChild>
              <Button variant={"outline"}>Cancel</Button>
            </Dialog.Trigger>
            <Dialog.Trigger asChild>
              <Button
                disabled={confirmationText !== "DELETE ACCOUNT"}
                className="bg-red-300 hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-gray-300"
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

export default DeleteAccountButton;
