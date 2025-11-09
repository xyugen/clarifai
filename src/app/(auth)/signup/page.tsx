import { Text } from "@/components/retroui/Text";
import { TextLink } from "@/components/retroui/TextLink";
import { PageRoutes } from "@/constants/page-routes";
import Divider from "../_components/divider";
import GoogleButton from "../_components/google-button";
import SignUpForm from "./_components/signup-form";

const Page = () => {
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

      <GoogleButton />

      <Divider />

      <SignUpForm />

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
};

export default Page;
