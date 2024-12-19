import { useEffect, useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FileInfo {
  name: string;
  size: number;
  created_at: string;
  path: string;
}

export const FileManager = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .list();

      if (error) throw error;

      setFiles(data.map(file => ({
        name: file.name,
        size: file.metadata.size,
        created_at: file.created_at,
        path: file.name
      })));
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error loading files",
        description: "Could not load your files.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not download the file.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from('files')
        .remove([path]);

      if (error) throw error;

      toast({
        title: "File deleted",
        description: "The file has been removed."
      });

      await loadFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn(
      "space-y-6",
      isMobile ? "p-0" : "container mx-auto p-6"
    )}>
      <h2 className="text-2xl font-bold mb-6">File Manager</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className={cn(isMobile && "hidden")}>Size</TableHead>
              <TableHead className={cn(isMobile && "hidden")}>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.path}>
                <TableCell>{file.name}</TableCell>
                <TableCell className={cn(isMobile && "hidden")}>
                  {Math.round(file.size / 1024)} KB
                </TableCell>
                <TableCell className={cn(isMobile && "hidden")}>
                  {new Date(file.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file.path)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};