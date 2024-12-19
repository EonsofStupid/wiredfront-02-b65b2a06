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

  // Provide default styles if no theme is found
  const defaultStyles = {
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF'
  };

  return (
    <section 
      className={cn(
        "themed-section relative min-h-screen w-full",
        theme?.className,
        className
      )}
      style={{ ...defaultStyles, ...theme?.styles }}
      data-theme={themeName}
    >
      {children}
    </section>
  );
};