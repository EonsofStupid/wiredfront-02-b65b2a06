import { useState } from "react";
import { Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRoutesStore } from "@/stores";
import { FileText } from "lucide-react";

export const RouteSettings = () => {
  const [newRoute, setNewRoute] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const routes = useRoutesStore((state) => state.routes);
  const addRoute = useRoutesStore((state) => state.addRoute);
  const removeRoute = useRoutesStore((state) => state.removeRoute);
  const { toast } = useToast();

  const handleAddRoute = () => {
    if (!newRoute || !newLabel) {
      toast({
        title: "Error",
        description: "Please enter both a route path and label",
        variant: "destructive",
      });
      return;
    }

    addRoute({
      path: newRoute,
      label: newLabel,
      icon: FileText,
      component: () => <div>Dynamic Route: {newLabel}</div>,
      isEnabled: true,
      requiresAuth: true,
      showInSidebar: true,
      showInNavigation: true,
    });
    
    setNewRoute("");
    setNewLabel("");
    toast({
      title: "Success",
      description: "Route added successfully",
    });
  };

  const handleRemoveRoute = (id: string) => {
    removeRoute(id);
    toast({
      title: "Success",
      description: "Route removed successfully",
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Route Management</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Add New Route</Label>
          <div className="space-y-2">
            <Input
              placeholder="/example-route"
              value={newRoute}
              onChange={(e) => setNewRoute(e.target.value)}
            />
            <Input
              placeholder="Route Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <Button onClick={handleAddRoute}>Add Route</Button>
        </div>

        <div className="space-y-2">
          <Label>Active Routes</Label>
          <div className="space-y-2">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <span className="font-medium">{route.label}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {route.path}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveRoute(route.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};