import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedCubes = () => {
  const [cubes, setCubes] = useState<Array<{ id: number; size: number; x: number; y: number }>>([]);

  useEffect(() => {
    const generateCubes = () => {
      return Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 100 + 50,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
    };

    setCubes(generateCubes());
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {cubes.map((cube) => (
        <motion.div
          key={cube.id}
          className="absolute rounded-xl bg-gradient-to-br from-[#38ffca]/10 to-[#e800aa]/10 backdrop-blur-sm"
          style={{
            width: cube.size,
            height: cube.size,
            left: cube.x,
            top: cube.y,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};