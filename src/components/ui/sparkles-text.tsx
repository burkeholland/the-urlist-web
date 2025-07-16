"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface SparklesTextProps {
  text: string;
  className?: string;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
}

export const SparklesText: React.FC<SparklesTextProps> = ({
  text,
  className,
  sparklesCount = 10,
  colors = {
    first: "#9E7AFF",
    second: "#FE8BBB",
  },
}) => {
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
    scale: number;
    lifespan: number;
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: sparklesCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: i % 2 === 0 ? colors.first : colors.second,
        delay: Math.random() * 2,
        scale: Math.random() * 1 + 0.3,
        lifespan: Math.random() * 10 + 5,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 3000);

    return () => clearInterval(interval);
  }, [sparklesCount, colors]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 -z-10">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              color: sparkle.color,
            }}
            initial={{
              scale: 0,
              rotate: 0,
            }}
            animate={{
              scale: [0, sparkle.scale, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: sparkle.lifespan,
              delay: sparkle.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
};
