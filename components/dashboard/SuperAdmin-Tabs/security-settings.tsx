'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Authentication Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="two-factor" className="text-white">Two-Factor Authentication</Label>
            <Switch id="two-factor" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="session-timeout" className="text-white">Session Timeout (30 minutes)</Label>
            <Switch id="session-timeout" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="ip-restriction" className="text-white">IP Restriction</Label>
            <Switch id="ip-restriction" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Security Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Login History
            </Button>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Security Alerts
            </Button>
            <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
              Download Security Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
