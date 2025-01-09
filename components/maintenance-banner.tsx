import { AlertTriangle } from "lucide-react";

export function MaintenanceBanner() {
  return (
    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-500">
            We're currently performing maintenance. Some features may be temporarily unavailable.
          </p>
        </div>
      </div>
    </div>
  );
}
