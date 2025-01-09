'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";

export function MaintenanceBanner() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  useEffect(() => {
    // Clear maintenance cookies
    deleteCookie('maintenance_mode');
    deleteCookie('maintenance_message');
    
    setIsMaintenanceMode(false);
    setMaintenanceMessage("");
  }, []);

  if (!isMaintenanceMode) return null;

  return (
    <Alert
      variant="destructive"
      className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t-2 border-destructive"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>System Maintenance</AlertTitle>
      <AlertDescription>
        {maintenanceMessage}
      </AlertDescription>
    </Alert>
  );
}
