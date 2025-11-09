import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { PageRoutes } from "@/constants/page-routes";
import Link from "next/link";

const Title = () => {
  return (
    <Link href={PageRoutes.DASHBOARD} className="flex items-center gap-3">
      <Card className="bg-primary flex size-12 rotate-3 items-center justify-center border-4 shadow-none hover:shadow-none">
        <Text as={"h3"}>C</Text>
      </Card>
      <Text as={"h4"}>ClarifAI</Text>
    </Link>
  );
};

export default Title;
