import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MessageSquare, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PageErrorBoundary } from "@/components/shared/PageErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface BotStats {
  totalQuotes: number;
  totalAchievements: number;
  serverCount: number;
}

const StatsSkeleton = () => (
  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-4 bg-[#1A1F2C] border-purple-500/20">
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const DashboardContent = () => {
  const [stats, setStats] = useState<BotStats>({
    totalQuotes: 0,
    totalAchievements: 0,
    serverCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchBotStats = async () => {
      try {
        const [quotesResponse, achievementsResponse, serversResponse] = await Promise.all([
          supabase.from('discord_quotes').select('count'),
          supabase.from('discord_achievements').select('count'),
          supabase.from('discord_server_config').select('count')
        ]);

        if (quotesResponse.error || achievementsResponse.error || serversResponse.error) {
          throw new Error('Failed to fetch statistics');
        }

        setStats({
          totalQuotes: quotesResponse.count || 0,
          totalAchievements: achievementsResponse.count || 0,
          serverCount: serversResponse.count || 0
        });

        toast({
          title: "Statistics Updated",
          description: "Dashboard data has been refreshed",
          className: "bg-dark-lighter border-neon-blue",
        });
      } catch (error) {
        console.error('Error fetching bot stats:', error);
        toast({
          title: "Error",
          description: "Failed to load bot statistics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBotStats();
  }, [toast]);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-3"
        )}
      >
        <motion.div
          custom={0}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="card-container"
        >
          <Card className="p-4 bg-[#1A1F2C] border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex flex-col items-center space-y-2">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div className="text-center">
                <p className="text-sm text-gray-400">Quotes</p>
                <motion.p 
                  className="text-xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {stats.totalQuotes}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="card-container"
        >
          <Card className="p-4 bg-[#1A1F2C] border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex flex-col items-center space-y-2">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div className="text-center">
                <p className="text-sm text-gray-400">Achievements</p>
                <motion.p 
                  className="text-xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {stats.totalAchievements}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className={cn(
            "card-container",
            isMobile && "col-span-2"
          )}
        >
          <Card className="p-4 bg-[#1A1F2C] border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="flex flex-col items-center space-y-2">
              <Bot className="h-8 w-8 text-purple-500" />
              <div className="text-center">
                <p className="text-sm text-gray-400">Active Servers</p>
                <motion.p 
                  className="text-xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {stats.serverCount}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "grid gap-6 mt-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        )}
      >
        <Card className="p-4 bg-[#1A1F2C] border-purple-500/20 hover:border-purple-500/40 transition-colors">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Recent Quotes</h2>
          <div className="space-y-4">
            <p className="text-gray-400">No recent quotes</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#1A1F2C] border-purple-500/20 hover:border-purple-500/40 transition-colors">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Latest Achievements</h2>
          <div className="space-y-4">
            <p className="text-gray-400">No recent achievements</p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

const Dashboard = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-full w-full overflow-auto custom-scrollbar">
      <div className={cn(
        "container mx-auto space-y-6",
        isMobile ? "p-0" : "p-6"
      )}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold mb-6 gradient-text"
        >
          Discord Bot Dashboard
        </motion.h1>
        
        <ErrorBoundary FallbackComponent={PageErrorBoundary}>
          <DashboardContent />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;