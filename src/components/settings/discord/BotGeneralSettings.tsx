import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BotGeneralSettingsProps {
  botConfig: any;
  isConnecting: boolean;
  onConnect: () => void;
  onUpdateConfig: (updates: any) => void;
}

export const BotGeneralSettings = ({
  botConfig,
  isConnecting,
  onConnect,
  onUpdateConfig,
}: BotGeneralSettingsProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-4">
        <div>
          <Label>Bot Name</Label>
          <Input
            value={botConfig?.name || ""}
            onChange={(e) => onUpdateConfig({ name: e.target.value })}
            placeholder="My Discord Bot"
          />
        </div>

        <div>
          <Label>Client ID</Label>
          <Input
            value={botConfig?.client_id || ""}
            onChange={(e) => onUpdateConfig({ client_id: e.target.value })}
            placeholder="Discord Client ID"
          />
        </div>

        <div>
          <Label>Bot Token</Label>
          <Input
            type="password"
            value={botConfig?.bot_token || ""}
            onChange={(e) => onUpdateConfig({ bot_token: e.target.value })}
            placeholder="Discord Bot Token"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={botConfig?.is_active || false}
            onCheckedChange={(checked) => onUpdateConfig({ is_active: checked })}
          />
          <Label>Active</Label>
        </div>

        <Button
          onClick={onConnect}
          disabled={isConnecting || !botConfig?.bot_token}
          className="w-full"
        >
          {isConnecting ? "Connecting..." : "Connect Bot"}
        </Button>
      </div>
    </Card>
  );
};