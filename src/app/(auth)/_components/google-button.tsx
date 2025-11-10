"use client";

import { Google } from "@/assets/icons/google";
import { Button } from "@/components/retroui/Button";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";

const GoogleButton = () => {
  const handleGoogleLogin = async () => {
    toast.promise(
      authClient.signIn.social({
        provider: "google",
        callbackURL: PageRoutes.DASHBOARD,
        errorCallbackURL: PageRoutes.LOGIN,
      }),
      {
        loading: "Signing in with Google...",
        success: "Successfully signed in!",
        error: "Failed to sign in with Google.",
      },
    );
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
