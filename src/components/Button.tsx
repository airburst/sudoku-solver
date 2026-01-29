import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  primary?: boolean;
  active?: boolean;
  size?: "normal" | "large";
}

const Button = ({
  children,
  primary = false,
  active = false,
  size = "normal",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "border-2 border-btn rounded-md cursor-pointer text-2xl w-full h-full shadow-md",
        size === "large" ? "py-2 px-8" : "py-2",
        primary ? "bg-btn text-fixed" : "bg-white text-guess",
        active ? "bg-blue-200" : "bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
