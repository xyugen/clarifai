import { Card } from "@/components/retroui/Card";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-cols-2 grid-rows-1 place-items-center">
      <h1>Auth Layout</h1>
      <Card className="p-8">{children}</Card>
    </div>
  );
};

export default Layout;
