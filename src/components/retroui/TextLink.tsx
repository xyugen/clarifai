import { cn } from "@/lib/utils";
import Link from "next/link";
import { type HTMLAttributes } from "react";

interface TextLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const TextLink = (props: TextLinkProps) => {
  const { className, href, ...otherProps } = props;

  return (
    <Link
      href={href}
      className={cn(
        "decoration-primary font-sans text-base underline-offset-2 hover:underline",
        className,
      )}
      {...otherProps}
    />
  );
};
