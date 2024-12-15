import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  const [squares, setSquares] = useState<Array<{ id: number; size: number; x: number; y: number }>>([]);

  useEffect(() => {
    const generateSquares = () => {
      return Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 100 + 50,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
    };

    setSquares(generateSquares());
  }, []);

  return (
    <>
      <div className="animated-gradient-bg" />
      <div className="twinkling-stars" />
      <div className="floating-squares">
        {squares.map((square) => (
          <motion.div
            key={square.id}
            className="floating-square"
            style={{
              width: square.size,
              height: square.size,
              left: square.x,
              top: square.y,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
    </>
  );
};