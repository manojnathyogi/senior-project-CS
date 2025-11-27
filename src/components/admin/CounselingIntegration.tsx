import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface System {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  enabled: boolean;
}

interface IntegrationSettings {
  systems: System[];
  dataSharing: {
    shareAnonymizedStats: boolean;
    shareRiskAssessment: boolean;
    shareEngagementMetrics: boolean;
    allowJournalAccess: boolean;
  };
  apiConfig: {
    endpoint: string;
    apiKey: string;
    webhookUrl: string;
  };
  status: {
    overall: string;
    history: Array<{
      title: string;
      description: string;
      timestamp: string;
    }>;
  };
}

const CounselingIntegration = () => {
  const [settings, setSettings] = useState<IntegrationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    endpoint: '',
    apiKey: '',
    webhookUrl: ''
  });

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await api.getIntegrationSettings();
        setSettings(data);
        setApiConfig(data.apiConfig || { endpoint: '', apiKey: '', webhookUrl: '' });
      } catch (error) {
        console.error("Error loading integration settings:", error);
        toast.error("Failed to load integration settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSystemToggle = async (systemId: string, enabled: boolean) => {
    if (!settings) return;

    const updatedSystems = settings.systems.map(sys =>
      sys.id === systemId ? { ...sys, enabled } : sys
    );

    const updatedSettings = {
      ...settings,
      systems: updatedSystems
    };

    setSettings(updatedSettings);

    try {
      await api.updateIntegrationSettings(updatedSettings);
      toast.success(`${enabled ? 'Enabled' : 'Disabled'} ${systemId.replace('_', ' ')}`);
    } catch (error) {
      console.error("Error updating system:", error);
      toast.error("Failed to update system settings");
      // Revert on error
      setSettings(settings);
    }
  };

  const handleDataSharingToggle = async (key: string, value: boolean) => {
    if (!settings) return;

    const updatedDataSharing = {
      ...settings.dataSharing,
      [key]: value
    };

    const updatedSettings = {
      ...settings,
      dataSharing: updatedDataSharing
    };

    setSettings(updatedSettings);

    try {
      await api.updateIntegrationSettings(updatedSettings);
    } catch (error) {
      console.error("Error updating data sharing:", error);
      toast.error("Failed to update data sharing settings");
      setSettings(settings);
    }
  };

  const handleApiConfigChange = (key: string, value: string) => {
    setApiConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleConnect = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        apiConfig
      };
      await api.updateIntegrationSettings(updatedSettings);
      toast.success("Integration settings saved successfully");
    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Failed to save integration settings");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (connected: boolean) => {
    return connected ? (
      <Badge className="bg-green-600">Connected</Badge>
    ) : (
      <Badge variant="outline">Not Connected</Badge>
    );
  };

  const getOverallStatus = () => {
    if (!settings) return { text: 'Not Configured', color: 'bg-gray-500' };
    
    switch (settings.status.overall) {
      case 'operational':
        return { text: 'All systems operational', color: 'bg-green-500' };
      case 'error':
        return { text: 'Some systems have errors', color: 'bg-red-500' };
      default:
        return { text: 'Not configured', color: 'bg-gray-500' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading integration settings...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Failed to load integration settings. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>University Counseling Integration</CardTitle>
          <CardDescription>
            Connect MindEase with your university's counseling center systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Systems</h3>
              
              {settings.systems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No systems available. Systems will appear here once configured.
                </div>
              ) : (
                <div className="grid gap-4">
                  {settings.systems.map((system) => (
                    <div key={system.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{system.name}</h4>
                          {getStatusBadge(system.connected)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {system.description}
                        </p>
                      </div>
                      <Switch
                        id={system.id}
                        checked={system.enabled}
                        onCheckedChange={(checked) => handleSystemToggle(system.id, checked)}
                        disabled={!system.connected}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Sharing Settings</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="share-anonymized"
                    checked={settings.dataSharing.shareAnonymizedStats}
                    onCheckedChange={(checked) => handleDataSharingToggle('shareAnonymizedStats', checked)}
                  />
                  <Label htmlFor="share-anonymized">Share anonymized usage statistics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="share-risk"
                    checked={settings.dataSharing.shareRiskAssessment}
                    onCheckedChange={(checked) => handleDataSharingToggle('shareRiskAssessment', checked)}
                  />
                  <Label htmlFor="share-risk">Share risk assessment data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="share-engagement"
                    checked={settings.dataSharing.shareEngagementMetrics}
                    onCheckedChange={(checked) => handleDataSharingToggle('shareEngagementMetrics', checked)}
                  />
                  <Label htmlFor="share-engagement">Share individual student engagement metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="share-journal"
                    checked={settings.dataSharing.allowJournalAccess}
                    onCheckedChange={(checked) => handleDataSharingToggle('allowJournalAccess', checked)}
                  />
                  <Label htmlFor="share-journal">Allow counselors to view student journal entries</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConnect} disabled={saving}>
            {saving ? 'Saving...' : 'Save Integration Settings'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Technical setup for system integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  placeholder="https://counseling-api.university.edu/v1/"
                  value={apiConfig.endpoint}
                  onChange={(e) => handleApiConfigChange('endpoint', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter API key"
                  value={apiConfig.apiKey}
                  onChange={(e) => handleApiConfigChange('apiKey', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input
                  id="webhook"
                  placeholder="https://mindease.app/api/webhook/university"
                  value={apiConfig.webhookUrl}
                  onChange={(e) => handleApiConfigChange('webhookUrl', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Current connection status and history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${overallStatus.color}`}></div>
                <span>{overallStatus.text}</span>
              </div>
              
              {settings.status.history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No integration history available. Status updates will appear here once integrations are configured and tested.
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  {settings.status.history.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                      <p className="text-muted-foreground">{item.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselingIntegration;
