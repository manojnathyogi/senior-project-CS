
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CounselingIntegration = () => {
  const handleConnect = () => {
    toast.success("Successfully connected to university counseling system");
  };

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
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Student Health Information System</h4>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Electronic Health Records system for student wellness data
                    </p>
                  </div>
                  <Switch id="sys-1" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Appointment Scheduling System</h4>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow students to schedule counseling sessions directly
                    </p>
                  </div>
                  <Switch id="sys-2" />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Crisis Alert System</h4>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Emergency notification system for high-risk students
                    </p>
                  </div>
                  <Switch id="sys-3" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Resource Allocation System</h4>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Connect to university budget and resource planning tools
                    </p>
                  </div>
                  <Switch id="sys-4" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Sharing Settings</h3>
              
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="share-1" defaultChecked />
                  <Label htmlFor="share-1">Share anonymized usage statistics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="share-2" defaultChecked />
                  <Label htmlFor="share-2">Share risk assessment data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="share-3" />
                  <Label htmlFor="share-3">Share individual student engagement metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="share-4" />
                  <Label htmlFor="share-4">Allow counselors to view student journal entries</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConnect}>Connect to University Systems</Button>
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
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background">
                  https://counseling-api.university.edu/v1/
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background">
                  ••••••••••••••••
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background">
                  https://mindease.app/api/webhook/university
                </div>
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
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>All systems operational</span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">API Connection Established</p>
                    <p className="text-muted-foreground">Connection to university systems successful</p>
                  </div>
                  <p className="text-muted-foreground">Today, 10:24 AM</p>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Student Health System Synced</p>
                    <p className="text-muted-foreground">Data synchronized successfully</p>
                  </div>
                  <p className="text-muted-foreground">Today, 10:25 AM</p>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Crisis Alert System Test</p>
                    <p className="text-muted-foreground">Test alert sent and received</p>
                  </div>
                  <p className="text-muted-foreground">Today, 10:26 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselingIntegration;
