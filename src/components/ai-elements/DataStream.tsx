import { motion } from "framer-motion";

export const DataStream = () => {
  const characters = "10".split("");
  const colors = [
    "#00dcf5", "#32ed83", "#5805fc", "#c202af", 
    "#fcdf03", "#8fd100", "#b3003e"
  ];
  
  return (
    <div className="absolute right-0 top-0 h-full w-1/4 pointer-events-none overflow-hidden opacity-20">
      {[...Array(10)].map((_, lineIndex) => (
        <motion.div
          key={lineIndex}
          className="absolute"
          style={{
            left: `${lineIndex * 10}%`,
            top: "-20px",
            color: colors[lineIndex % colors.length],
            textShadow: `0 0 10px ${colors[lineIndex % colors.length]}`,
          }}
          initial={{ y: -100 }}
          animate={{ y: "100vh" }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        >
          {[...Array(20)].map((_, charIndex) => (
            <motion.div 
              key={charIndex} 
              className="my-1"
              animate={{
                color: colors,
                textShadow: colors.map(color => `0 0 10px ${color}`),
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {characters[Math.floor(Math.random() * characters.length)]}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};