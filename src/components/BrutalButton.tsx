"use client";

import { ButtonHTMLAttributes } from "react";

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

const VARIANTS = {
  primary: "bg-hot-pink text-white",
  secondary: "bg-sun-yellow text-ink",
  danger: "bg-coral text-white",
  success: "bg-mint text-ink",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function BrutalButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: BrutalButtonProps) {
  return (
    <button
      className={`font-black uppercase tracking-wide brutal-border brutal-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
