import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import React from "react";

const AuthForm = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <section className="lg:3/4 w-full max-w-lg">
      <div className="mb-4 flex items-center justify-center lg:hidden">
        <Text
          as="h2"
          className="bg-primary mr-4 inline-block -rotate-1 border-4 border-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          ClarifAI
        </Text>
      </div>
      <Card className="w-full p-6 shadow-none hover:shadow-none lg:p-8">
        {children}
      </Card>
    </section>
  );
};

export default AuthForm;
