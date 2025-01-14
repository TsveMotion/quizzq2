'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DatabaseManagement() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Connection Status</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Database Size</span>
              <span className="text-white">128 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Last Backup</span>
              <span className="text-white">2024-01-14 12:00:00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Database Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Create Backup
            </Button>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Optimize Database
            </Button>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Run Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
