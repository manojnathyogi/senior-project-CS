
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Sun, Moon, Settings, Shield, HelpCircle, LogOut } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReports: true,
    peerMessages: true,
    tips: false
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center text-white text-3xl font-bold">
            S
          </div>
          <h2 className="text-xl font-bold mt-4">Sam Johnson</h2>
          <p className="text-sm text-muted-foreground">Howard University</p>
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
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, dailyReminders: checked})
                }
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
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, weeklyReports: checked})
                }
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
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, peerMessages: checked})
                }
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
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, tips: checked})
                }
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
                <Sun className="h-5 w-5 mr-2" />
                <Label className="text-base">Dark Mode</Label>
              </div>
              <Switch 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Shield className="mr-2 h-5 w-5" />
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start" size="lg">
            <HelpCircle className="mr-2 h-5 w-5" />
            Help & Support
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-500" size="lg">
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Profile;
