import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import TopNav from "./_components/top-nav";
import { getSession } from "@/server/better-auth/server";

const Layout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await getSession();

  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  return (
    <div className="relative min-h-screen bg-cyan-100 font-sans antialiased">
      <TopNav />
      {children}
    </div>
  );
};

export default Layout;
