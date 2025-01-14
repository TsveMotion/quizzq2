'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Mail, 
  Shield, 
  Globe,
  Palette,
  Database
} from "lucide-react";

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-50">School Settings</h2>
        <p className="text-blue-200">Manage your school preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* School Profile */}
        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <h3 className="text-lg font-semibold text-blue-50 mb-4">School Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-blue-200">School Name</label>
              <Input 
                defaultValue="St. Mary's High School"
                className="mt-1 bg-blue-900/20 border-blue-800/40 text-blue-50"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200">Address</label>
              <Input 
                defaultValue="123 Education Street, Academic City"
                className="mt-1 bg-blue-900/20 border-blue-800/40 text-blue-50"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200">Contact Email</label>
              <Input 
                defaultValue="admin@stmarys.edu"
                className="mt-1 bg-blue-900/20 border-blue-800/40 text-blue-50"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200">Phone Number</label>
              <Input 
                defaultValue="+1 (555) 123-4567"
                className="mt-1 bg-blue-900/20 border-blue-800/40 text-blue-50"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-50">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-50">Email Notifications</p>
                <p className="text-sm text-blue-200">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-50">System Alerts</p>
                <p className="text-sm text-blue-200">Important system notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 bg-blue-800/20 border-blue-800/40">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-50">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-50">Two-Factor Authentication</p>
                <p className="text-sm text-blue-200">Additional security layer</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-50">Login Notifications</p>
                <p className="text-sm text-blue-200">Alert on new device login</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="border-blue-800/40 text-blue-200 hover:bg-blue-800/20">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
