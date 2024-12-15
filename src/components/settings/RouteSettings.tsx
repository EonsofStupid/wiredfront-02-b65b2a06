import { useState } from "react";
import { Plus, Trash2, Save, Toggle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRoutesStore } from "@/stores/routes";
import type { Route } from "@/stores/routes";

export function RouteSettings() {
  const { toast } = useToast();
  const { routes, addRoute, updateRoute, deleteRoute, toggleRoute } = useRoutesStore();
  const [newRoute, setNewRoute] = useState({ path: "", label: "" });

  const handleAddRoute = () => {
    if (!newRoute.path || !newRoute.label) {
      toast({
        title: "Validation Error",
        description: "Both path and label are required",
        variant: "destructive",
      });
      return;
    }

    addRoute({
      path: newRoute.path,
      label: newRoute.label,
      icon: null,
      isEnabled: true,
      requiresAuth: true,
    });

    setNewRoute({ path: "", label: "" });
    
    toast({
      title: "Route Added",
      description: `Added new route: ${newRoute.label}`,
    });
  };

  const handleToggleRoute = (id: string) => {
    toggleRoute(id);
    toast({
      title: "Route Updated",
      description: "Route visibility has been toggled",
    });
  };

  const handleDeleteRoute = (id: string) => {
    deleteRoute(id);
    toast({
      title: "Route Deleted",
      description: "The route has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Routes & Navigation</h2>
      </div>

      <Card className="p-4 bg-[#1A1F2C] border-purple-500/20">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Route path (e.g., /dashboard)"
              value={newRoute.path}
              onChange={(e) => setNewRoute({ ...newRoute, path: e.target.value })}
              className="bg-[#221F26] border-purple-500/20"
            />
            <Input
              placeholder="Route label"
              value={newRoute.label}
              onChange={(e) => setNewRoute({ ...newRoute, label: e.target.value })}
              className="bg-[#221F26] border-purple-500/20"
            />
            <Button 
              onClick={handleAddRoute}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </div>

          <div className="space-y-2">
            {routes.map((route) => (
              <div
                key={route.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#221F26] border border-purple-500/20"
              >
                <div className="flex items-center gap-4">
                  {route.icon && <route.icon className="w-4 h-4 text-purple-400" />}
                  <span className="text-purple-300">{route.label}</span>
                  <span className="text-gray-400">{route.path}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={route.isEnabled}
                    onCheckedChange={() => handleToggleRoute(route.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRoute(route.id)}
                    className="hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}