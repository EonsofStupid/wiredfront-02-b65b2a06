import { motion } from "framer-motion";
import { VisualEffects } from "@/types/visual-effects";

interface EffectPreviewProps {
  effects: VisualEffects;
}

export const EffectPreview = ({ effects }: EffectPreviewProps) => {
  const getPreviewStyle = () => {
    const style: any = {
      fontFamily: effects.theme.fontFamily === 'default' ? 'inherit' : effects.theme.fontFamily,
      color: effects.theme.primaryColor,
      transition: 'all 0.3s ease',
    };

    if (effects.effects.neon.enabled) {
      style.textShadow = `0 0 ${effects.effects.neon.intensity * 10}px ${effects.effects.neon.color}`;
    }

    if (effects.effects.twilight.enabled) {
      style.background = `linear-gradient(45deg, ${effects.theme.primaryColor}, ${effects.theme.secondaryColor})`;
      style.WebkitBackgroundClip = 'text';
      style.WebkitTextFillColor = 'transparent';
      style.filter = `brightness(${1 + effects.effects.twilight.intensity})`;
    }

    return style;
  };

  return (
    <div className="relative p-8 rounded-lg bg-gradient-to-br from-dark to-dark-lighter">
      <motion.div
        className="text-2xl font-bold text-center"
        style={getPreviewStyle()}
        animate={{
          scale: [1, 1.02, 1],
          transition: { duration: 2, repeat: Infinity }
        }}
      >
        {effects.preview.sampleText}
      </motion.div>
    </div>
  );
};