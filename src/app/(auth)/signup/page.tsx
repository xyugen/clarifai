"use client";

import { Text } from "@/components/retroui/Text";
import GoogleButton from "../_components/google-button";
import Divider from "../_components/divider";
import { Label } from "@/components/retroui/Label";
import { Input } from "@/components/retroui/Input";
import { useState } from "react";
import { TextLink } from "@/components/retroui/TextLink";
import { Button } from "@/components/retroui/Button";
import { ArrowRight } from "lucide-react";
import { PageRoutes } from "@/constants/page-routes";

const Page = () => {
  {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = () => {
      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Signup:", { name, email, password });
      // Add your signup logic here
    };

    return (
      <div>
        <div className="mb-6">
          <Text as="h3" className="mb-1 font-black">
            SIGN UP
          </Text>
          <Text as="p" className="text-gray-600">
            Join thousands of students learning smarter!
          </Text>
        </div>

        {/* Google Login Button */}
        <GoogleButton />

        <Divider />

        {/* Email/Password Form */}
        <div className="space-y-2">
          <div>
            <Label htmlFor="name" className="mb-2 font-bold">
              Name
            </Label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="mb-6">
            <Label htmlFor="confirmPassword" className="mt-4 mb-2 font-bold">
              Confirm Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            onClick={handleSubmit}
            variant="default"
            className="mb-4 flex w-full items-center justify-center gap-2"
          >
            <span>SIGN UP</span> <ArrowRight className="size-5" />
          </Button>
        </div>

        <div className="mt-6 border-t-4 border-black pt-4 text-center">
          <Text>
            Already have an account?{" "}
            <TextLink
              href={PageRoutes.LOGIN}
              className="font-black text-blue-600 decoration-4 underline-offset-2 hover:underline"
            >
              LOG IN
            </TextLink>
          </Text>
        </div>
      </div>
    );
  }
};

export default Page;
