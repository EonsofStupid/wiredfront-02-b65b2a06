import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export const PageErrorBoundary = ({ error, resetErrorBoundary }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto p-4 space-y-4"
    >
      <Alert variant="destructive" className="bg-dark-lighter border-red-500/50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </motion.div>
        <AlertTitle className="text-red-500">Something went wrong</AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-gray-300">{error.message}</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={resetErrorBoundary}
              className="bg-dark-lighter hover:bg-dark text-white border border-red-500/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </motion.div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};