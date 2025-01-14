import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Configure system email settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SMTP Host</Label>
            <Input placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label>SMTP Port</Label>
            <Input placeholder="587" />
          </div>
          <div className="space-y-2">
            <Label>SMTP Username</Label>
            <Input placeholder="username" />
          </div>
          <div className="space-y-2">
            <Label>SMTP Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button>Save Email Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Configure API keys and endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Stripe Secret Key</Label>
            <Input placeholder="sk_test_..." />
          </div>
          <div className="space-y-2">
            <Label>Stripe Webhook Secret</Label>
            <Input placeholder="whsec_..." />
          </div>
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <Input placeholder="sk-..." />
          </div>
          <Button>Save API Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Maintenance</CardTitle>
          <CardDescription>System maintenance and backup settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">Enable automatic daily backups</p>
            </div>
            <Switch />
          </div>
          <div className="pt-4">
            <Button variant="secondary">Run Manual Backup</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
