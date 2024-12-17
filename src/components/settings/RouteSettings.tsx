import { useState } from "react";
import { Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRoutesStore } from "@/stores/routes";

export const RouteSettings = () => {
  const [newRoute, setNewRoute] = useState("");
  const routes = useRoutesStore((state) => state.routes);
  const addRoute = useRoutesStore((state) => state.addRoute);
  const removeRoute = useRoutesStore((state) => state.removeRoute);
  const { toast } = useToast();

  const handleAddRoute = () => {
    if (!newRoute) {
      toast({
        title: "Error",
        description: "Please enter a route path",
        variant: "destructive",
      });
      return;
    }

    addRoute({
      path: newRoute,
      label: newRoute.split('/').filter(Boolean).pop() || newRoute,
    });
    
    setNewRoute("");
    toast({
      title: "Success",
      description: "Route added successfully",
    });
  };

  const handleRemoveRoute = (path: string) => {
    removeRoute(path);
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
          <div className="flex gap-2">
            <Input
              placeholder="/example-route"
              value={newRoute}
              onChange={(e) => setNewRoute(e.target.value)}
            />
            <Button onClick={handleAddRoute}>Add</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Active Routes</Label>
          <div className="space-y-2">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <span>{route.path}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveRoute(route.path)}
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