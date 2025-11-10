"use client";

import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { type ComponentPropsWithoutRef } from "react";

const Menu = DropdownMenu.Root;
const Trigger = DropdownMenu.Trigger;

type IMenuContent = ComponentPropsWithoutRef<typeof DropdownMenu.Content>;

const Content = ({ className, align, ...props }: IMenuContent) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      side="bottom"
      align={align ?? "start"}
      className={cn(
        "absolute top-2 min-w-20 border-2 bg-white shadow-md",
        className,
      )}
      {...props}
    />
  </DropdownMenu.Portal>
);

const MenuItem = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      "hover:bg-primary focus:bg-primary relative flex cursor-default items-center rounded-xs px-2 py-1.5 text-sm text-black outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
MenuItem.displayName = "MenuItem";

const MenuComponent = Object.assign(Menu, {
  Trigger,
  Content,
  Item: MenuItem,
});

export { MenuComponent as Menu };
