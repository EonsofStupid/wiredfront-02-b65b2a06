import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/stores";

interface Route {
  id: string;
  path: string;
  label: string;
  icon?: string;
}

export function RouteSettings() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([
    { id: "1", path: "/dashboard", label: "Dashboard" },
    { id: "2", path: "/settings", label: "Settings" },
    { id: "3", path: "/profile", label: "Profile" }
  ]);
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

    setRoutes([
      ...routes,
      { id: crypto.randomUUID(), ...newRoute }
    ]);
    setNewRoute({ path: "", label: "" });
    
    toast({
      title: "Route Added",
      description: `Added new route: ${newRoute.label}`,
    });
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter(route => route.id !== id));
    toast({
      title: "Route Deleted",
      description: "The route has been removed",
    });
  };

  const handleSaveRoutes = () => {
    // Here you would typically save to your state management or backend
    toast({
      title: "Routes Saved",
      description: "Your route configuration has been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Routes & Navigation</h2>
        <Button 
          onClick={handleSaveRoutes}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
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
                  <span className="text-purple-300">{route.label}</span>
                  <span className="text-gray-400">{route.path}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRoute(route.id)}
                  className="hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}