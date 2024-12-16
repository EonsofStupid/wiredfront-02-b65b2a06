import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton = ({ className, count = 1 }: LoadingSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "h-4 bg-dark-lighter/50 rounded animate-pulse",
            className
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          style={{
            backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            backgroundSize: "200% 100%",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      ))}
    </>
  );
};