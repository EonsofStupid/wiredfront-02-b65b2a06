import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export const PageErrorBoundary = ({ error, resetErrorBoundary }: Props) => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error.message}</p>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};