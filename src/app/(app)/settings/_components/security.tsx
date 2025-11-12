"use client";

import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { authClient } from "@/server/better-auth/client";
import { Lock } from "lucide-react";
import OAuthNotice from "./oauth-notice";
import { PasswordChangeForm } from "./password-change-form";

const SecuritySection = () => {
  const wasGoogle = authClient.isLastUsedLoginMethod("google");

  return (
    <Card className="w-full border-2 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center border-2 border-black bg-pink-300">
          <Lock className="size-5" />
        </div>
        <Text as="h2" className="text-2xl font-black">
          SECURITY
        </Text>
      </div>

      {wasGoogle ? <OAuthNotice /> : <PasswordChangeForm />}
    </Card>
  );
};

export default SecuritySection;
