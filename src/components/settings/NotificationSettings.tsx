import { useSettings } from "@/contexts/SettingsContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const { preferences, updatePreferences } = useSettings();

  const handleNotificationChange = (enabled: boolean) => {
    updatePreferences({ notifications: enabled });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text mb-4">Notification Settings</h2>
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="notifications" className="text-lg font-medium">Enable Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about important updates and events
            </p>
          </div>
          <Switch
            id="notifications"
            checked={preferences.notifications}
            onCheckedChange={handleNotificationChange}
            className="data-[state=checked]:bg-[#9b87f5]"
          />
        </div>
      </div>
    </div>
  );
}