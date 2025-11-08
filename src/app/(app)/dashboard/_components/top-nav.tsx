"use client";

import { Avatar } from "@/components/retroui/Avatar";
import { Button } from "@/components/retroui/Button";
import { Menu } from "@/components/retroui/Menu";
import Title from "@/components/title";
import { PageRoutes } from "@/constants/page-routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TopNav = () => {
  const router = useRouter();

  const [userName] = useState("Alex");

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Title />

        <Menu>
          <Menu.Trigger asChild>
            <Button
              variant={"outline"}
              className="flex items-center gap-3 px-4 py-2 font-sans"
            >
              <Avatar className="size-8">
                <Avatar.Image src="/avatar.png" alt="User Avatar" />
                <Avatar.Fallback>{userName[0]}</Avatar.Fallback>
              </Avatar>
              <span className="hidden font-bold sm:block">{userName}</span>
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
          </Menu.Content>
        </Menu>
      </div>
    </nav>
  );
};

export default TopNav;
