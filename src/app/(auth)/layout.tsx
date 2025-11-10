import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import AuthForm from "./_components/auth-form";
import Branding from "./_components/branding";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(PageRoutes.DASHBOARD);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 place-items-center bg-cyan-100 p-4 lg:grid-cols-2">
      {/* Left Side - Branding */}
      <Branding />

      {/* Right Side - Auth Form */}
      <AuthForm>{children}</AuthForm>
    </div>
  );
};

export default Layout;
