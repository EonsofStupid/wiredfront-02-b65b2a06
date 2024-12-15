import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MessageSquare, Trophy, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface BotStats {
  totalQuotes: number;
  totalAchievements: number;
  serverCount: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<BotStats>({
    totalQuotes: 0,
    totalAchievements: 0,
    serverCount: 0
  });
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

        setStats({
          totalQuotes: quotesResponse.count || 0,
          totalAchievements: achievementsResponse.count || 0,
          serverCount: serversResponse.count || 0
        });
      } catch (error) {
        console.error('Error fetching bot stats:', error);
        toast({
          title: "Error",
          description: "Failed to load bot statistics",
          variant: "destructive",
        });
      }
    };

    fetchBotStats();
  }, [toast]);

  return (
    <div className={cn(
      "container mx-auto space-y-6",
      isMobile ? "p-0" : "p-6"
    )}>
      <h1 className="text-2xl font-bold mb-6">Discord Bot Dashboard</h1>
      
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-3"
      )}>
        <Card className="p-4 bg-[#1A1F2C] border-purple-500/20">
          <div className="flex flex-col items-center space-y-2">
            <MessageSquare className="h-8 w-8 text-purple-500" />
            <div className="text-center">
              <p className="text-sm text-gray-400">Quotes</p>
              <p className="text-xl font-bold">{stats.totalQuotes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-[#1A1F2C] border-purple-500/20">
          <div className="flex flex-col items-center space-y-2">
            <Trophy className="h-8 w-8 text-purple-500" />
            <div className="text-center">
              <p className="text-sm text-gray-400">Achievements</p>
              <p className="text-xl font-bold">{stats.totalAchievements}</p>
            </div>
          </div>
        </Card>

        <Card className={cn(
          "p-4 bg-[#1A1F2C] border-purple-500/20",
          isMobile && "col-span-2"
        )}>
          <div className="flex flex-col items-center space-y-2">
            <Bot className="h-8 w-8 text-purple-500" />
            <div className="text-center">
              <p className="text-sm text-gray-400">Active Servers</p>
              <p className="text-xl font-bold">{stats.serverCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}>
        <Card className="p-4 bg-[#1A1F2C] border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4">Recent Quotes</h2>
          <div className="space-y-4">
            <p className="text-gray-400">No recent quotes</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#1A1F2C] border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4">Latest Achievements</h2>
          <div className="space-y-4">
            <p className="text-gray-400">No recent achievements</p>
          </div>
        </Card>
      </div>

      {!isMobile && (
        <div className="mt-6">
          <Link 
            to="/settings"
            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Bot
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;