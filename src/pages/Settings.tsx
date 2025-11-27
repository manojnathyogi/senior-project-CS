
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

const Settings = () => {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
  });

  const [accountSettings, setAccountSettings] = useState({
    notifications: true,
    emailUpdates: false,
    marketingEmails: false,
    dataSharing: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "everyone",
    activityStatus: true,
    dataCollection: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Not authenticated");
        setLoading(false);
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update profile' }));
        throw new Error(error.error || error.message || 'Failed to update profile');
      }

      toast.success("Profile updated successfully");
      // Refresh user data
      if (refreshUser) {
        refreshUser();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = () => {
    toast.success("Password reset email has been sent");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        {authLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Please sign in to access settings</p>
          </div>
        ) : (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={profileData.name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username" 
                      value={profileData.username} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={profileData.email} 
                      onChange={handleInputChange}
                      disabled={true}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email addresses cannot be changed
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Change your password or recover your current one
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={handlePasswordChange}>
                    Reset Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch 
                    checked={theme === "dark"} 
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                      toast.success(`${checked ? "Dark" : "Light"} mode activated`);
                    }} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable push notifications
                    </p>
                  </div>
                  <Switch 
                    checked={accountSettings.notifications} 
                    onCheckedChange={(checked) => 
                      setAccountSettings({...accountSettings, notifications: checked})
                    } 
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={accountSettings.emailUpdates} 
                    onCheckedChange={(checked) => 
                      setAccountSettings({...accountSettings, emailUpdates: checked})
                    } 
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch 
                    checked={accountSettings.marketingEmails} 
                    onCheckedChange={(checked) => 
                      setAccountSettings({...accountSettings, marketingEmails: checked})
                    } 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive"
                  onClick={() => toast.error("This feature is disabled in the demo")}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <select 
                    id="profileVisibility"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={privacy.profileVisibility}
                    onChange={(e) => 
                      setPrivacy({...privacy, profileVisibility: e.target.value})
                    }
                  >
                    <option value="everyone">Everyone</option>
                    <option value="university">University Only</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-base">Activity Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you're active on MindEase
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.activityStatus} 
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, activityStatus: checked})
                    } 
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection for improving the app
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.dataCollection} 
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, dataCollection: checked})
                    } 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Settings;
