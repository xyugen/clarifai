import { Google } from "@/assets/icons/google";
import { Button } from "@/components/retroui/Button";
import React from "react";

const GoogleButton = () => {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement OAuth logic here
    // window.location.href = '/api/auth/google';
  };

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-3"
      onClick={handleGoogleLogin}
    >
      <Google className="size-5" />
      CONTINUE WITH GOOGLE
    </Button>
  );
};

export default GoogleButton;
