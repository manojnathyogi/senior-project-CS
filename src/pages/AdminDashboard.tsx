
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Users, BarChart, FileText, Server } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import UsageStatsCards from "@/components/admin/UsageStatsCards";
import MentalHealthTrends from "@/components/admin/MentalHealthTrends";
import ResourceAllocation from "@/components/admin/ResourceAllocation";
import CounselingIntegration from "@/components/admin/CounselingIntegration";

interface User {
  type: "student" | "admin";
  name: string;
  university?: string;
  email: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [timeFilter, setTimeFilter] = useState("week");
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.type === "admin") {
        setUser(parsedUser);
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Time Period:</span>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex gap-2">
                <BarChart size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex gap-2">
                <Users size={16} />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex gap-2">
                <Calendar size={16} />
                <span>Trends</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex gap-2">
                <FileText size={16} />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="integration" className="flex gap-2">
                <Server size={16} />
                <span>Integration</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <UsageStatsCards timeFilter={timeFilter} />
              <MentalHealthTrends timeFilter={timeFilter} />
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                  <CardDescription>
                    Anonymous user data and engagement metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>University</TableHead>
                        <TableHead>Active Users</TableHead>
                        <TableHead>Avg. Engagement</TableHead>
                        <TableHead>Most Used Feature</TableHead>
                        <TableHead>High Risk Users</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Howard University</TableCell>
                        <TableCell>245</TableCell>
                        <TableCell>68%</TableCell>
                        <TableCell>Mood Tracker</TableCell>
                        <TableCell>12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Georgetown University</TableCell>
                        <TableCell>187</TableCell>
                        <TableCell>57%</TableCell>
                        <TableCell>CBT Exercises</TableCell>
                        <TableCell>8</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>University of Maryland</TableCell>
                        <TableCell>203</TableCell>
                        <TableCell>62%</TableCell>
                        <TableCell>Meditation</TableCell>
                        <TableCell>9</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends">
              <MentalHealthTrends timeFilter={timeFilter} />
            </TabsContent>
            
            <TabsContent value="resources">
              <ResourceAllocation />
            </TabsContent>
            
            <TabsContent value="integration">
              <CounselingIntegration />
            </TabsContent>
            
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
