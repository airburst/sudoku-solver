import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  primary?: boolean;
  size?: "normal" | "large";
}

const Button = ({
  children,
  primary = false,
  size = "normal",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "border-2 border-btn rounded-[5px] cursor-pointer text-2xl w-full h-full",
        size === "large" ? "py-2 px-8" : "py-2",
        primary ? "bg-btn text-fixed" : "bg-white text-guess",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
