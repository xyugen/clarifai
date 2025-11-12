"use client";

import { Google } from "@/assets/icons/google";
import { Button } from "@/components/retroui/Button";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";

const GoogleButton = () => {
  const handleGoogleLogin = async () => {
    const toastId = toast.loading("Redirecting to Google...");
    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: PageRoutes.DASHBOARD,
          errorCallbackURL: PageRoutes.LOGIN,
        },
        {
          onSuccess: () => {
            toast.success("Redirecting to Google...", {
              id: toastId,
            });
          },
          onError: (error) => {
            toast.error(
              error.error.message ||
                "Failed to redirect to Google. Please try again.",
              {
                id: toastId,
              },
            );
          },
        },
      );
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        id: toastId,
      });
      console.error(error);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-3"
      onClick={handleGoogleLogin}
    >
      <Google className="size-5" />
      CONTINUE WITH GOOGLE
    </Button>
  );
};

export default GoogleButton;
