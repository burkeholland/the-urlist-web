"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface ShimmerButtonProps {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
  className,
  children,
  onClick,
  type = "button",
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden px-6 py-2 font-medium transition-all duration-300",
        "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
        "hover:from-indigo-600 hover:to-purple-700",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      style={{
        borderRadius,
      }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 -top-[2px] -bottom-[2px] -left-[2px] -right-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        initial={{ x: "-100%" }}
        animate={isHovered && !disabled ? { x: "100%" } : { x: "-100%" }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
        }}
      />
    </motion.button>
  );
};
