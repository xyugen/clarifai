import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import TopNav from "./_components/top-nav";

const Layout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  return (
    <div className="min-h-screen bg-cyan-100 font-sans antialiased">
      <TopNav user={session.user} />
      {children}
    </div>
  );
};

export default Layout;
