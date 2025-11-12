import { lastLoginMethodClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [lastLoginMethodClient()],
});

export type Session = typeof authClient.$Infer.Session;
