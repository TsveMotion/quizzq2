'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Log {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export function ActivityLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement logs fetching
    setLoading(false);
    setLogs([
      {
        id: '1',
        action: 'User Login',
        user: 'john.doe@example.com',
        timestamp: new Date().toISOString(),
        details: 'Successful login from IP 192.168.1.1'
      }
    ]);
  }, []);

  if (loading) {
    return <div className="text-white">Loading logs...</div>;
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id} className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">{log.action}</CardTitle>
            <span className="text-xs text-white/70">{new Date(log.timestamp).toLocaleString()}</span>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-white/70">
              <p>User: {log.user}</p>
              <p>{log.details}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
