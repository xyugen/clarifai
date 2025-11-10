import { Button } from "@/components/retroui/Button";
import { TextLink } from "@/components/retroui/TextLink";
import Title from "@/components/title";
import { PageRoutes } from "@/constants/page-routes";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import Link from "next/link";

const TopNav = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="border-b-2 border-black bg-white p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Title />
        <div className="items-center gap-6">
          {session ? (
            <Link href={PageRoutes.DASHBOARD}>
              <Button variant="default" className="text-sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <TextLink
                href={PageRoutes.LOGIN}
                className="hidden font-bold decoration-4 hover:underline md:flex"
              >
                Login
              </TextLink>
              <Link href={PageRoutes.SIGNUP}>
                <Button variant="default" className="text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
