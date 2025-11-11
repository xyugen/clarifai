import { Text } from "@/components/retroui/Text";
import { TextLink } from "@/components/retroui/TextLink";
import { PageRoutes } from "@/constants/page-routes";
import type { Metadata } from "next";
import Divider from "../_components/divider";
import GoogleButton from "../_components/google-button";
import LoginForm from "./components/login-form";

export const metadata: Metadata = {
  title: "Log In",
};

const Page = () => {
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

      <GoogleButton />

      <Divider />

      <LoginForm />

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
