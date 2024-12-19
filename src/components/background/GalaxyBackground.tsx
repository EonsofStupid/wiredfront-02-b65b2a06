import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const GalaxyBackground = () => {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2,
      }));
    };
    setStars(generateStars());
  }, []);

  return (
    <div className="galaxy-background">
      <div className="galaxy-gradient" />
      
      {stars.map((star, index) => (
        <motion.div
          key={index}
          className="galaxy-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};