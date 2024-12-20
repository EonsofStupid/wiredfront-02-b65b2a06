import { useState } from "react";
import { useThemeStore } from "@/stores/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Layout } from "lucide-react";

export const ThemeManager = () => {
  const [selectedComponent, setSelectedComponent] = useState("section");
  const [themeName, setThemeName] = useState("default");
  const [styles, setStyles] = useState({});
  const { saveTheme, isLoading } = useThemeStore();

  const handleSaveTheme = async () => {
    await saveTheme(selectedComponent, themeName, styles);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Theme Manager</h2>
      </div>

      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">
            <Layout className="w-4 h-4 mr-2" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="components">
            <Palette className="w-4 h-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="layouts">
            <Settings className="w-4 h-4 mr-2" />
            Layouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Theme Name</Label>
              <Input
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="Enter theme name"
              />
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                onChange={(e) => 
                  setStyles(prev => ({
                    ...prev,
                    backgroundColor: e.target.value
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                onChange={(e) => 
                  setStyles(prev => ({
                    ...prev,
                    color: e.target.value
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Custom CSS Classes</Label>
              <Input
                placeholder="Enter custom Tailwind classes"
                onChange={(e) => 
                  setStyles(prev => ({
                    ...prev,
                    className: e.target.value
                  }))
                }
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveTheme}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Theme"}
          </Button>
        </TabsContent>

        <TabsContent value="components">
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Component theming coming soon...
          </div>
        </TabsContent>

        <TabsContent value="layouts">
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Layout theming coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};