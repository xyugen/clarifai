"use client";

import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Text } from "@/components/retroui/Text";
import { TextLink } from "@/components/retroui/TextLink";
import { PageRoutes } from "@/constants/page-routes";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Divider from "../_components/divider";
import GoogleButton from "../_components/google-button";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    console.log("Login:", { email, password });
    // Add your login logic here
  };

  return (
    <div>
      <div className="mb-6">
        <Text as="h2" className="mb-2 text-2xl! font-black">
          LOG IN
        </Text>
        <Text as="p" className="text-gray-600">
          Welcome back! Ready to learn?
        </Text>
      </div>

      {/* Google Login Button */}
      <GoogleButton />

      <Divider />

      {/* Email/Password Form */}
      <div className="space-y-2">
        <div>
          <Label htmlFor="email" className="mb-2 font-bold">
            Email
          </Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="mt-4 mb-2 font-bold">
            Password
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 flex justify-end">
          <TextLink
            href={PageRoutes.FORGOT_PASSWORD}
            className="text-sm font-bold decoration-4 underline-offset-2 hover:underline"
          >
            FORGOT PASSWORD?
          </TextLink>
        </div>

        <Button
          onClick={handleSubmit}
          variant="default"
          className="mb-4 flex w-full items-center justify-center gap-2"
        >
          <span>LOG IN</span> <ArrowRight className="size-5" />
        </Button>
      </div>

      <div className="mt-6 border-t-4 border-black pt-4 text-center">
        <Text>
          Don&lsquo;t have an account?{" "}
          <TextLink
            href={PageRoutes.SIGNUP}
            className="font-black text-blue-600 decoration-4 underline-offset-2 hover:underline"
          >
            SIGN UP
          </TextLink>
        </Text>
      </div>
    </div>
  );
};

export default Page;
