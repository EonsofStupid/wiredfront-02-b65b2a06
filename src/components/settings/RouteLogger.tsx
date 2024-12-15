import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RouteLog {
  timestamp: Date;
  path: string;
  status: 'success' | 'error';
  message?: string;
}

export function RouteLogger() {
  const [logs, setLogs] = useState<RouteLog[]>([]);
  const location = useLocation();

  useEffect(() => {
    const newLog: RouteLog = {
      timestamp: new Date(),
      path: location.pathname,
      status: 'success'
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  }, [location]);

  return (
    <Card className="p-4 bg-[#1A1F2C] border-purple-500/20">
      <h3 className="text-lg font-semibold mb-4">Route Logs</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-2 rounded-lg bg-[#221F26] border border-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className={`text-sm ${
                  log.status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {log.status}
                </span>
              </div>
              <div className="text-purple-300">{log.path}</div>
              {log.message && (
                <div className="text-sm text-gray-400">{log.message}</div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}