"use client";

import { Avatar } from "@/components/retroui/Avatar";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import Title from "@/components/title";
import { Menu, Settings } from "lucide-react";
import { useState } from "react";

const TopNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName] = useState("Alex");

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="border-4 border-black bg-yellow-400 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 md:hidden"
          >
            <Menu className="size-6" strokeWidth={3} />
          </Button>

          <Title />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden items-center gap-2 md:flex"
          >
            <Settings className="size-4" strokeWidth={3} />
            SETTINGS
          </Button>
          <Card className="flex items-center gap-3 px-4 py-2 shadow-none hover:shadow-none">
            <Avatar className="size-8">
              <Avatar.Image src="/avatar.png" alt="User Avatar" />
              <Avatar.Fallback>{userName[0]}</Avatar.Fallback>
            </Avatar>
            <span className="hidden font-bold sm:block">{userName}</span>
          </Card>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
