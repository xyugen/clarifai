import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 grid-rows-1 place-items-center">
      <div className="hidden md:block">
        <Text as={"h1"} className="text-4xl font-bold">
          Welcome to{" "}
          <span className="text-primary stroke-foreground text-shadow-foreground stroke-1 text-shadow-[4px_4px_0]">
            ClarifAI
          </span>
        </Text>
        <Text as={"p"} className="mt-4 text-gray-600">
          Your AI-powered study companion.
        </Text>
      </div>
      <Card className="m-2! p-8 w-full md:w-2/3 shadow-none hover:shadow-none">
        {children}
      </Card>
    </div>
  );
};

export default Layout;
