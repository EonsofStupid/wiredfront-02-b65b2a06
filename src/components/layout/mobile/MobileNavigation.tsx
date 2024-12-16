import { Home, FileText, Bot, Settings, Upload, Image } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAIStore } from "@/stores";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MobileNavigation = () => {
  const location = useLocation();
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);
  const { toast } = useToast();
  
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

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Files", path: "/files" },
    { icon: Upload, label: "Upload", onClick: initiateFileUpload },
    { icon: Bot, label: "AI", onClick: toggleAI },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="h-16 glass-card border-t border-white/10">
      <div className="h-full flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path ? location.pathname === item.path : false;
          
          const content = (
            <div className={cn(
              "flex flex-col items-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="focus:outline-none"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className="focus:outline-none"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};