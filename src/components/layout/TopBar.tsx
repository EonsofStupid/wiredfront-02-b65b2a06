import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  File, 
  Settings, 
  Image, 
  Bot, 
  Menu, 
  Search, 
  Bell, 
  User,
  PanelLeftClose,
  PanelRightClose,
  Upload 
} from "lucide-react";
import { useAIStore, useLayoutStore } from "@/stores";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const TopBar = () => {
  const { toast } = useToast();
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);
  const { 
    sidebarOpen, 
    rightSidebarOpen,
    toggleSidebar, 
    toggleRightSidebar 
  } = useLayoutStore();
  
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

        // Upload file to Supabase Storage
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
    <div className="top-bar glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="nav-button"
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Link to="/" className="text-lg font-semibold gradient-text">
          wiredFRONT
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={initiateFileUpload}
            className="nav-button"
          >
            <File className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAI}
            className="nav-button"
          >
            <Bot className="h-4 w-4" />
          </Button>
          <Link to="/media">
            <Button variant="ghost" size="icon" className="nav-button">
              <Image className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="nav-button">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="nav-button">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="nav-button">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await supabase.auth.signOut();
            }}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/settings">
          <Button variant="ghost" size="icon" className="nav-button">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleRightSidebar}
          className="nav-button"
        >
          <PanelRightClose className={`h-5 w-5 transition-transform ${rightSidebarOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </div>
  );
};