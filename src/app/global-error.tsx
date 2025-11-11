"use client";

import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";

const GlobalError = ({
  _error,
  reset,
}: {
  _error: Error;
  reset: () => void;
}) => {
  return (
    <html lang="en">
      <body>
        <Text as={"h2"}>Something went wrong!</Text>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </body>
    </html>
  );
};

export default GlobalError;
