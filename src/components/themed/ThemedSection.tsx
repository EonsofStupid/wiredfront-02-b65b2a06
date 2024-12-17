import { useThemeStore } from "@/stores/theme";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ThemedSectionProps {
  themeName: string;
  className?: string;
  children: React.ReactNode;
}

export const ThemedSection = ({ 
  themeName,
  className,
  children 
}: ThemedSectionProps) => {
  const { componentThemes, loadTheme } = useThemeStore();
  const theme = componentThemes[`section-${themeName}`];

  useEffect(() => {
    loadTheme('section', themeName);
  }, [themeName, loadTheme]);

  return (
    <section 
      className={cn(
        "themed-section relative min-h-screen",
        theme?.className,
        className
      )}
      style={{
        background: theme?.styles?.background || 'linear-gradient(135deg, #1a1a1a 0%, #2b2b2b 100%)',
        ...theme?.styles
      }}
      data-theme={themeName}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-dark/50 to-transparent" />
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};