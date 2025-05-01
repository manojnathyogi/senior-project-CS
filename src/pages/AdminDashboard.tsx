
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BarChart, FileText, Server, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/AdminHeader";
import UsageStatsCards from "@/components/admin/UsageStatsCards";
import MentalHealthTrends from "@/components/admin/MentalHealthTrends";
import ResourceAllocation from "@/components/admin/ResourceAllocation";
import CounselingIntegration from "@/components/admin/CounselingIntegration";

interface User {
  type: "student" | "admin" | "counselor";
  name: string;
  university?: string;
  email: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  moodScore: number;
  riskLevel: "low" | "medium" | "high";
  lastActive: string;
  counselorAssigned: boolean;
}

interface CounselorData {
  id: string;
  name: string;
  email: string;
  status: "online" | "away" | "offline";
  studentCount: number;
  specialty: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [timeFilter, setTimeFilter] = useState("week");
  const [students, setStudents] = useState<StudentData[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@university.edu",
      moodScore: 45,
      riskLevel: "high",
      lastActive: "2 hours ago",
      counselorAssigned: true
    },
    {
      id: "2",
      name: "Jordan Lee",
      email: "jordan@university.edu",
      moodScore: 68,
      riskLevel: "medium",
      lastActive: "Yesterday",
      counselorAssigned: true
    },
    {
      id: "3",
      name: "Taylor Smith",
      email: "taylor@university.edu",
      moodScore: 82,
      riskLevel: "low",
      lastActive: "3 days ago",
      counselorAssigned: false
    },
    {
      id: "4",
      name: "Morgan Rivera",
      email: "morgan@university.edu",
      moodScore: 53,
      riskLevel: "medium",
      lastActive: "Today",
      counselorAssigned: false
    },
  ]);
  
  const [counselors, setCounselors] = useState<CounselorData[]>([
    {
      id: "1",
      name: "Dr. Carter",
      email: "carter@university.edu",
      status: "online",
      studentCount: 12,
      specialty: "Anxiety & Depression"
    },
    {
      id: "2",
      name: "Dr. Williams",
      email: "williams@university.edu",
      status: "offline",
      studentCount: 8,
      specialty: "Academic Stress"
    },
    {
      id: "3",
      name: "Dr. Rodriguez",
      email: "rodriguez@university.edu",
      status: "away",
      studentCount: 15,
      specialty: "Crisis Intervention"
    },
  ]);
  
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
  
  const assignCounselor = (studentId: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, counselorAssigned: true }
          : student
      )
    );
    toast.success("Counselor chat recommended for student");
  };
  
  const getStatusBadge = (status: "online" | "away" | "offline") => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "away":
        return <Badge className="bg-amber-500">Away</Badge>;
      default:
        return <Badge variant="outline">Offline</Badge>;
    }
  };
  
  const getRiskBadge = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium Risk</Badge>;
      default:
        return <Badge className="bg-green-500">Low Risk</Badge>;
    }
  };
  
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
            <TabsList className="grid grid-cols-6 mb-8">
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
              <TabsTrigger value="counselors" className="flex gap-2">
                <MessageSquare size={16} />
                <span>Counselors</span>
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
            
            <TabsContent value="counselors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Counselor Status</CardTitle>
                    <CardDescription>
                      Monitor counselor availability and workload
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Specialty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {counselors.map((counselor) => (
                          <TableRow key={counselor.id}>
                            <TableCell>{counselor.name}</TableCell>
                            <TableCell>{getStatusBadge(counselor.status)}</TableCell>
                            <TableCell>{counselor.studentCount}</TableCell>
                            <TableCell>{counselor.specialty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Students Requiring Counseling</CardTitle>
                    <CardDescription>
                      Recommend counselor chat based on mental wellness data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Mood Score</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students
                          .filter(student => student.riskLevel !== "low")
                          .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.moodScore}%</TableCell>
                              <TableCell>{getRiskBadge(student.riskLevel)}</TableCell>
                              <TableCell>
                                {student.counselorAssigned ? (
                                  <Badge variant="outline" className="border-green-500 text-green-700">
                                    Counselor Assigned
                                  </Badge>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => assignCounselor(student.id)}
                                  >
                                    Recommend Chat
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Chat Communications Log</CardTitle>
                  <CardDescription>
                    Overview of student-counselor communications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Counselor</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead>Messages</TableHead>
                        <TableHead>Next Session</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Alex Johnson</TableCell>
                        <TableCell>Dr. Carter</TableCell>
                        <TableCell>Today, 9:15 AM</TableCell>
                        <TableCell>12</TableCell>
                        <TableCell>Tomorrow, 2:00 PM</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jordan Lee</TableCell>
                        <TableCell>Dr. Williams</TableCell>
                        <TableCell>Yesterday</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>Not scheduled</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
