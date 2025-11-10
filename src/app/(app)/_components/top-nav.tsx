"use client";

import { Avatar } from "@/components/retroui/Avatar";
import { Button } from "@/components/retroui/Button";
import { Menu } from "@/components/retroui/Menu";
import Title from "@/components/title";
import { PageRoutes } from "@/constants/page-routes";
import { authClient } from "@/server/better-auth/client";
import type { User } from "better-auth";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

const TopNav = ({ user }: { user: User | null }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    toast.promise(authClient.signOut(), {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Error signing out. Please try again.",
    });
    router.push(PageRoutes.LOGIN);
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Title />

        {user ? (
          <Menu>
            <Menu.Trigger asChild>
              <Button
                variant={"outline"}
                className="flex items-center gap-3 px-4 py-2 font-sans"
              >
                <Avatar className="size-8">
                  <Avatar.Image
                    src={user.image ?? "/avatar.png"}
                    alt="User Avatar"
                  />
                  <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                </Avatar>
                <span className="hidden font-bold sm:block">{user.name}</span>
              </Button>
            </Menu.Trigger>
            <Menu.Content align="end" className="right-0 z-50 min-w-36">
              <Menu.Item
                onClick={() => {
                  router.push(PageRoutes.SETTINGS);
                }}
              >
                Settings
              </Menu.Item>
              <Menu.Item onClick={handleSignOut}>Logout</Menu.Item>
            </Menu.Content>
          </Menu>
        ) : (
          <Button
            variant="outline"
            className="px-4 py-2 font-sans"
            onClick={() => router.push(PageRoutes.LOGIN)}
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
