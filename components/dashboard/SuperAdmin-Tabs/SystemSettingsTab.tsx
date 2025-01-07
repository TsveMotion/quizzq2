'use client';

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { setCookie, getCookie } from 'cookies-next';

export default function SystemSettingsTab() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Load initial state from cookies
  useEffect(() => {
    const mode = getCookie('maintenance_mode') === 'true';
    const message = getCookie('maintenance_message')?.toString() || '';
    setMaintenanceMode(mode);
    setMaintenanceMessage(message);
  }, []);

  const handleMaintenanceModeChange = async (checked: boolean) => {
    try {
      // Save to cookies
      setCookie('maintenance_mode', checked.toString(), { path: '/' });
      if (maintenanceMessage) {
        setCookie('maintenance_message', maintenanceMessage, { path: '/' });
      }

      setMaintenanceMode(checked);
      
      // Show appropriate toast
      toast({
        title: checked ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
        description: checked 
          ? "The system is now in maintenance mode. Only superadmins can access it."
          : "The system is now accessible to all users.",
        variant: checked ? "destructive" : "default",
      });

      // Refresh the page to apply changes
      router.refresh();
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      toast({
        title: "Error",
        description: "Failed to update maintenance mode settings.",
        variant: "destructive",
      });
    }
  };

  const handleMessageChange = (message: string) => {
    setMaintenanceMessage(message);
    if (maintenanceMode) {
      setCookie('maintenance_message', message, { path: '/' });
      toast({
        title: "Message Updated",
        description: "Maintenance message has been updated successfully.",
      });
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="maintenance-mode" className="text-lg font-semibold">
              Maintenance Mode
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={handleMaintenanceModeChange}
              />
              <Label htmlFor="maintenance-mode">
                {maintenanceMode ? "Enabled" : "Disabled"}
              </Label>
            </div>
            
            {maintenanceMode && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  When maintenance mode is enabled, only superadmins can access the system.
                  All other users will see the maintenance page.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-message" className="text-lg font-semibold">
              Maintenance Message
            </Label>
            <Textarea
              id="maintenance-message"
              placeholder="Enter a message to display during maintenance..."
              value={maintenanceMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="h-32"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
