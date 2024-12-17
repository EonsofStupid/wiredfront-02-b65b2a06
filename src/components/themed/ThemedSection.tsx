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
        "themed-section",
        theme?.className,
        className
      )}
      style={theme?.styles}
      data-theme={themeName}
    >
      {children}
    </section>
  );
};