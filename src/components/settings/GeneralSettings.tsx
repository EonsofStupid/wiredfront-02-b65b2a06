import { useSettings } from "@/contexts/SettingsContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ThemeMode } from "@/types/settings";

export function GeneralSettings() {
  const { preferences, updatePreferences } = useSettings();

  const handleThemeChange = (theme: ThemeMode) => {
    updatePreferences({ theme });
  };

  const handleLanguageChange = (language: string) => {
    updatePreferences({ language });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text mb-4">General Settings</h2>
      <div className="grid gap-6">
        <div className="glass-card p-4 space-y-2">
          <Label htmlFor="theme" className="text-lg font-medium">Theme</Label>
          <Select
            value={preferences.theme}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger id="theme" className="glass-input">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="glass-card p-4 space-y-2">
          <Label htmlFor="language" className="text-lg font-medium">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="language" className="glass-input">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}