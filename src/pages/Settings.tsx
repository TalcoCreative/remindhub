import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wifi, WifiOff, Key, Globe, Shield } from 'lucide-react';

export default function Settings() {
  const [liveMode, setLiveMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [secret, setSecret] = useState('');
  const [webhookUrl] = useState('https://remindhub.app/api/webhook/qontak');

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure RemindHub integrations and preferences</p>
      </div>

      <Tabs defaultValue="whatsapp">
        <TabsList>
          <TabsTrigger value="whatsapp">WhatsApp Integration</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="mt-4 space-y-4">
          {/* Mode toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {liveMode ? <Wifi className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4 text-warning" />}
                API Mode
              </CardTitle>
              <CardDescription>
                Switch between Dummy Mode (simulated) and Live API Mode (Qontak Mekari).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Switch checked={liveMode} onCheckedChange={setLiveMode} id="api-mode" />
                  <Label htmlFor="api-mode" className="cursor-pointer">
                    {liveMode ? 'Live API Mode' : 'Dummy Mode'}
                  </Label>
                </div>
                <Badge variant={liveMode ? 'default' : 'secondary'}>
                  {liveMode ? 'Connected' : 'Simulated'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* API Credentials */}
          <Card className={!liveMode ? 'opacity-60 pointer-events-none' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4 text-primary" /> Qontak Mekari Credentials
              </CardTitle>
              <CardDescription>Enter your Qontak API credentials to enable live WhatsApp messaging.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input placeholder="qontak_api_key_xxxxx" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input type="password" placeholder="••••••••" value={secret} onChange={(e) => setSecret(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={webhookUrl} className="font-mono text-xs" />
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(webhookUrl)}>
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure this URL in your Qontak dashboard to receive incoming messages.
                </p>
              </div>
              <Button disabled={!apiKey || !secret}>Save & Connect</Button>
            </CardContent>
          </Card>

          {/* Provider Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-primary" /> Provider Abstraction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                RemindHub uses a provider abstraction layer. Currently configured for <strong>Qontak Mekari</strong>.
                Future providers (WhatsApp Business API by Meta) can be added without UI changes.
              </p>
              <div className="mt-3 flex gap-2">
                <Badge>Qontak Mekari</Badge>
                <Badge variant="outline">Meta WABA (Future)</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" /> Roles & Permissions
              </CardTitle>
              <CardDescription>Configure user roles for access control.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { role: 'Admin', desc: 'Full access to all modules, settings, and user management.' },
                  { role: 'Operator', desc: 'Access to inbox, leads, and operations. Cannot change settings.' },
                  { role: 'Viewer', desc: 'Read-only access to dashboard and reports.' },
                ].map((r) => (
                  <div key={r.role} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <Badge variant="secondary">{r.role}</Badge>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
