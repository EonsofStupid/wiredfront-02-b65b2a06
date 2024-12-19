import { Menu, Bell, Bot, Search, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayoutStore, useAIStore } from "@/stores";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const MobileHeader = () => {
  const { toast } = useToast();
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);
  
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
    <header className="h-14 glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="text-lg font-semibold gradient-text">
          wiredFRONT
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={initiateFileUpload}>
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleAI}>
          <Bot className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await supabase.auth.signOut();
            }}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};