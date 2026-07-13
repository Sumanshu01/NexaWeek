import { ReactNode } from "react";

interface BrutalCardProps {
  children: ReactNode;
  className?: string;
  color?: string;
  animate?: boolean;
}

export default function BrutalCard({
  children,
  className = "",
  color = "bg-white",
  animate = false,
}: BrutalCardProps) {
  return (
    <div
      className={`brutal-border ${color} p-6 ${animate ? "animate-pop-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
