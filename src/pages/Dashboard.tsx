import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MessageSquare, Trophy, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Discord Bot Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#1A1F2C] border-purple-500/20">
          <div className="flex items-center space-x-4">
            <MessageSquare className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Total Quotes</p>
              <p className="text-2xl font-bold">{stats.totalQuotes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1A1F2C] border-purple-500/20">
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Achievements Earned</p>
              <p className="text-2xl font-bold">{stats.totalAchievements}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1A1F2C] border-purple-500/20">
          <div className="flex items-center space-x-4">
            <Bot className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-400">Active Servers</p>
              <p className="text-2xl font-bold">{stats.serverCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 bg-[#1A1F2C] border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4">Recent Quotes</h2>
          <div className="space-y-4">
            {/* Quote list will be implemented here */}
            <p className="text-gray-400">No recent quotes</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#1A1F2C] border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4">Latest Achievements</h2>
          <div className="space-y-4">
            {/* Achievement list will be implemented here */}
            <p className="text-gray-400">No recent achievements</p>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Link 
          to="/settings"
          className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure Bot
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;