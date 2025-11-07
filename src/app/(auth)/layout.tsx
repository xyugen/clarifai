import { Card } from "@/components/retroui/Card";
import React from "react";
import Branding from "./_components/branding";
import { Text } from "@/components/retroui/Text";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-cols-1 place-items-center bg-cyan-100 p-4 lg:grid-cols-2">
      {/* Left Side - Branding */}
      <Branding />

      {/* Right Side - Auth Form */}
      <section className="w-full max-w-lg lg:3/4">
        <div className="mb-4 flex items-center justify-center lg:hidden">
          <Text
            as="h2"
            className="mr-4 inline-block -rotate-1 border-4 border-black bg-primary px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            ClarifAI
          </Text>
        </div>
        <Card className="w-full p-6 shadow-none hover:shadow-none lg:p-8">
          {children}
        </Card>
      </section>
    </div>
  );
};

export default Layout;
