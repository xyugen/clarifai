import { Button } from "@/components/retroui/Button";
import { TextLink } from "@/components/retroui/TextLink";
import { PageRoutes } from "@/constants/page-routes";
import Link from "next/link";
import Title from "@/components/title";

const TopNav = () => {
  return (
    <nav className="border-b-2 border-black bg-white p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Title />
        <div className="hidden items-center gap-6 md:flex">
          <TextLink
            href={PageRoutes.LOGIN}
            className="font-bold decoration-4 hover:underline"
          >
            Login
          </TextLink>
          <Link href={PageRoutes.SIGNUP}>
            <Button variant="default" className="text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
