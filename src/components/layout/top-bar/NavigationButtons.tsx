import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Bot } from "lucide-react";
import { useAIStore, useRoutesStore } from "@/stores";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const NavigationButtons = () => {
  const { toast } = useToast();
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);
  const navigationRoutes = useRoutesStore((state) => 
    state.routes.filter(route => route.isEnabled && route.showInNavigation)
  );
  
  const [fileInputRef] = useState(() => document.createElement('input'));
  fileInputRef.type = 'file';
  fileInputRef.multiple = true;

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;

    const files = Array.from(target.files);
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded.`
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file(s).",
        variant: "destructive"
      });
    }
  };

  fileInputRef.onchange = handleFileUpload;

  const initiateFileUpload = () => {
    fileInputRef.click();
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={initiateFileUpload}
        className="nav-button"
      >
        <Upload className="h-4 w-4" />
      </Button>
      
      {navigationRoutes.map(route => (
        <Link key={route.id} to={route.path}>
          <Button variant="ghost" size="icon" className="nav-button">
            <route.icon className="h-4 w-4" />
          </Button>
        </Link>
      ))}
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleAI}
        className="nav-button"
      >
        <Bot className="h-4 w-4" />
      </Button>
    </div>
  );
};