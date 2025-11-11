import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-100">
      <div className="m-2 flex size-fit flex-col items-center gap-2 text-center md:size-3/5">
        <Card className="px-2 py-1">404</Card>
        <Text as={"h2"} className="text-4xl font-bold">
          Not Found
        </Text>
        <Text as={"p"} className="text-xl">
          The page you are looking for might have been removed or had its name
          changed or is temporarily unavailable.
        </Text>
        <Link href={PageRoutes.HOME} className="text-lg">
          <Button variant={"outline"} size={"md"} className="bg-background">
            HOMEPAGE
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
