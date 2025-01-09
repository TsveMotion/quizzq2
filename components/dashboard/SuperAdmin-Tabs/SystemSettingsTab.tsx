'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export function SystemSettingsTab() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    maxConcurrentUsers: 100,
    backupFrequency: 24,
    logRetentionDays: 30,
    apiRateLimit: 100
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement settings save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gray-900/40 border-white/10">
        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-gray-400">
                Enable to put the system in maintenance mode
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, maintenanceMode: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Debug Mode</Label>
              <p className="text-sm text-gray-400">
                Enable detailed logging and debugging features
              </p>
            </div>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, debugMode: checked }))
              }
            />
          </div>

          <div>
            <Label>Max Concurrent Users</Label>
            <Input
              type="number"
              value={settings.maxConcurrentUsers}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  maxConcurrentUsers: parseInt(e.target.value) 
                }))
              }
              className="mt-1 bg-white/5 border-white/10"
            />
          </div>

          <div>
            <Label>Backup Frequency (hours)</Label>
            <Input
              type="number"
              value={settings.backupFrequency}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  backupFrequency: parseInt(e.target.value) 
                }))
              }
              className="mt-1 bg-white/5 border-white/10"
            />
          </div>

          <div>
            <Label>Log Retention (days)</Label>
            <Input
              type="number"
              value={settings.logRetentionDays}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  logRetentionDays: parseInt(e.target.value) 
                }))
              }
              className="mt-1 bg-white/5 border-white/10"
            />
          </div>

          <div>
            <Label>API Rate Limit (requests/minute)</Label>
            <Input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => 
                setSettings(prev => ({ 
                  ...prev, 
                  apiRateLimit: parseInt(e.target.value) 
                }))
              }
              className="mt-1 bg-white/5 border-white/10"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="mt-6 w-full bg-white/10 hover:bg-white/20"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Card>

      <Card className="p-6 bg-gray-900/40 border-white/10">
        <h2 className="text-xl font-semibold mb-4">System Information</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Node Version</span>
            <span>18.x</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Database</span>
            <span>PostgreSQL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Environment</span>
            <span>{process.env.NODE_ENV}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Backup</span>
            <span>2 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
