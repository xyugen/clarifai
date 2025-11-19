"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

const LoginPrompt: React.FC = () => {
  return (
    <Card className="border-2 border-black bg-blue-100 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-black bg-yellow-300">
        <LogIn className="size-8" />
      </div>
      <Text as="h3" className="mb-2 text-xl">
        Sign in to answer this question
      </Text>
      <Text as="p" className="mb-6 text-gray-700">
        Create an account or sign in to submit your answer and get personalized feedback.
      </Text>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={PageRoutes.LOGIN}>
          <Button variant="default" className="w-full sm:w-auto">
            <LogIn className="mr-2 size-4" strokeWidth={3} />
            SIGN IN
          </Button>
        </Link>
        <Link href={PageRoutes.SIGNUP}>
          <Button variant="outline" className="bg-white w-full sm:w-auto">
            <UserPlus className="mr-2 size-4" strokeWidth={3} />
            CREATE ACCOUNT
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default LoginPrompt;
