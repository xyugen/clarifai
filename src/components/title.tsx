import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import React from "react";

const Title = () => {
  return (
    <div className="flex items-center gap-3">
      <Card className="bg-primary flex size-12 rotate-3 items-center justify-center border-4 shadow-none hover:shadow-none">
        <Text as={"h3"}>C</Text>
      </Card>
      <Text as={"h4"}>ClarifAI</Text>
    </div>
  );
};

export default Title;
