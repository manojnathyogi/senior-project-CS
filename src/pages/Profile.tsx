
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Sun, Moon, Settings, Shield, HelpCircle, LogOut, Mail, Phone, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReports: true,
    peerMessages: true,
    tips: false
  });
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleNotificationChange = (key: keyof typeof notifications, checked: boolean) => {
    setNotifications({...notifications, [key]: checked});
    // TODO: Save to backend when notification preferences API is ready
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white text-3xl font-bold">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <h2 className="text-xl font-bold mt-4">{user?.name || 'User'}</h2>
          <p className="text-sm text-muted-foreground">{user?.university || user?.email}</p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">Wellness check-ins and mood tracking</p>
              </div>
              <Switch 
                checked={notifications.dailyReminders}
                onCheckedChange={(checked) => handleNotificationChange('dailyReminders', checked)}
              />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Summary</Label>
                <p className="text-sm text-muted-foreground">Your weekly wellness report</p>
              </div>
              <Switch 
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
              />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Peer Messages</Label>
                <p className="text-sm text-muted-foreground">New messages in peer support chats</p>
              </div>
              <Switch 
                checked={notifications.peerMessages}
                onCheckedChange={(checked) => handleNotificationChange('peerMessages', checked)}
              />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Tips</Label>
                <p className="text-sm text-muted-foreground">Mental wellness tips and advice</p>
              </div>
              <Switch 
                checked={notifications.tips}
                onCheckedChange={(checked) => handleNotificationChange('tips', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5 flex items-center">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 mr-2" />
                ) : (
                  <Sun className="h-5 w-5 mr-2" />
                )}
                <Label className="text-base">Dark Mode</Label>
              </div>
              <Switch 
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                  toast.success(`${checked ? "Dark" : "Light"} mode activated`);
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="lg"
            onClick={() => setPrivacyDialogOpen(true)}
          >
            <Shield className="mr-2 h-5 w-5" />
            Privacy Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="lg"
            onClick={() => setHelpDialogOpen(true)}
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            Help & Support
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500" 
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </main>
      
      <Navigation />

      {/* Privacy Settings Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Settings
            </DialogTitle>
            <DialogDescription>
              Manage your privacy and data settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Data Privacy</Label>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and stored securely. We never share your personal information with third parties.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Anonymous Mode</Label>
              <p className="text-sm text-muted-foreground">
                In peer support chats, your identity remains anonymous. Only you can see your own messages.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Data Collection</Label>
              <p className="text-sm text-muted-foreground">
                We collect anonymized usage data to improve the app. No personally identifiable information is included.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Account Deletion</Label>
              <p className="text-sm text-muted-foreground">
                You can delete your account at any time from Settings. All your data will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setPrivacyDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help & Support Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </DialogTitle>
            <DialogDescription>
              Get help and contact support
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Mail className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <Label className="font-semibold">Email Support</Label>
                  <p className="text-sm text-muted-foreground">
                    support@mindease.edu
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <Label className="font-semibold">Phone Support</Label>
                  <p className="text-sm text-muted-foreground">
                    (202) 806-6100
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monday - Friday, 9 AM - 5 PM EST
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <MessageSquare className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <Label className="font-semibold">Crisis Support</Label>
                  <p className="text-sm text-muted-foreground">
                    Call 988 for 24/7 crisis support
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available anytime for mental health emergencies
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Frequently Asked Questions</Label>
              <div className="space-y-2 text-sm">
                <p className="font-medium">How do I reset my password?</p>
                <p className="text-muted-foreground">
                  Go to Settings → Account → Reset Password
                </p>
                <p className="font-medium mt-3">How do I change my email?</p>
                <p className="text-muted-foreground">
                  Email addresses cannot be changed for security reasons. Contact support if needed.
                </p>
                <p className="font-medium mt-3">Is my data secure?</p>
                <p className="text-muted-foreground">
                  Yes, all data is encrypted and stored securely. See Privacy Settings for more details.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
