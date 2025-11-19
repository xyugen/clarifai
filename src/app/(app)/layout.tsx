import type React from "react";
import TopNav from "./_components/top-nav";

const Layout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="relative min-h-screen bg-cyan-100 font-sans antialiased">
      <TopNav />
      {children}
    </div>
  );
};

export default Layout;
