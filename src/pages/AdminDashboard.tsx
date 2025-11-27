
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, BarChart, FileText, Server, MessageSquare, UserPlus } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/AdminHeader";
import UsageStatsCards from "@/components/admin/UsageStatsCards";
import MentalHealthTrends from "@/components/admin/MentalHealthTrends";
import ResourceAllocation from "@/components/admin/ResourceAllocation";
import CounselingIntegration from "@/components/admin/CounselingIntegration";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

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

interface AllUserData {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "counselor";
  university?: string;
  username?: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [timeFilter, setTimeFilter] = useState("week");
  // Start with empty data for new admin - data should come from backend
  const [students, setStudents] = useState<StudentData[]>([]);
  const [counselors, setCounselors] = useState<CounselorData[]>([]);
  const [allUsers, setAllUsers] = useState<AllUserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [createCounselorOpen, setCreateCounselorOpen] = useState(false);
  const [counselorForm, setCounselorForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    username: ""
  });
  const [creatingCounselor, setCreatingCounselor] = useState(false);
  
  const assignCounselor = async (studentId: string) => {
    try {
      await api.assignCounselor(studentId);
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, counselorAssigned: true }
          : student
      )
    );
    toast.success("Counselor chat recommended for student");
    } catch (error: any) {
      console.error("Error assigning counselor:", error);
      toast.error(error.message || "Failed to assign counselor");
    }
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
  
  useEffect(() => {
    if (!authLoading) {
  if (!user) {
        navigate("/login");
      } else if (user.role !== "admin") {
        toast.error("Access denied. Admin access required.");
        navigate("/");
      } else {
        // Load users when admin is authenticated
        loadAllUsers();
        loadCounselors();
        loadStudentsRequiringCounseling();
        loadChatCommunicationsLog();
      }
    }
  }, [user, authLoading, navigate, timeFilter]);

  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getAllUsers();
      // Transform data to match AllUserData interface
      const transformedUsers = data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university || undefined,
        username: user.username || undefined,
        isEmailVerified: user.is_email_verified || false,
        createdAt: user.created_at,
        lastLogin: user.last_login || undefined,
      }));
      setAllUsers(transformedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setAllUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadCounselors = async () => {
    try {
      const data = await api.getCounselors();
      setCounselors(data.map((counselor: any) => ({
        id: counselor.id,
        name: counselor.name,
        email: counselor.email,
        status: counselor.status,
        studentCount: counselor.studentCount || 0,
        specialty: counselor.specialty || 'General Counseling'
      })));
    } catch (error) {
      console.error("Error loading counselors:", error);
      setCounselors([]);
    }
  };

  const loadStudentsRequiringCounseling = async () => {
    try {
      const data = await api.getStudentsRequiringCounseling(timeFilter);
      setStudents(data.map((student: any) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        moodScore: student.moodScore,
        riskLevel: student.riskLevel,
        lastActive: student.lastActive,
        counselorAssigned: student.counselorAssigned || false
      })));
    } catch (error) {
      console.error("Error loading students requiring counseling:", error);
      setStudents([]);
    }
  };

  const loadChatCommunicationsLog = async () => {
    try {
      const data = await api.getChatCommunicationsLog();
      // Store in state if needed, or use directly
      // For now, we'll just ensure it's empty if no data
    } catch (error) {
      console.error("Error loading communications log:", error);
    }
  };

  const handleCreateCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!counselorForm.name || !counselorForm.email || !counselorForm.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (counselorForm.password !== counselorForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (counselorForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setCreatingCounselor(true);
    
    try {
      await api.createCounselor({
        email: counselorForm.email,
        name: counselorForm.name,
        password: counselorForm.password,
        university: counselorForm.university || undefined,
        username: counselorForm.username || undefined
      });
      
      toast.success("Counselor account created successfully");
      setCreateCounselorOpen(false);
      setCounselorForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        university: "",
        username: ""
      });
      
      // Reload users list
      loadAllUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create counselor account");
    } finally {
      setCreatingCounselor(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
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
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>All Users</CardTitle>
                      <CardDescription>
                        Complete list of all registered users in the system.
                      </CardDescription>
                    </div>
                    <Dialog open={createCounselorOpen} onOpenChange={setCreateCounselorOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <UserPlus size={16} />
                          Create Counselor
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Counselor Account</DialogTitle>
                          <DialogDescription>
                            Create a new counselor account. The counselor will be able to log in immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCounselor}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="counselor-name">Full Name *</Label>
                              <Input
                                id="counselor-name"
                                value={counselorForm.name}
                                onChange={(e) => setCounselorForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Dr. Jane Smith"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="counselor-email">Email *</Label>
                              <Input
                                id="counselor-email"
                                type="email"
                                value={counselorForm.email}
                                onChange={(e) => setCounselorForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="counselor@university.edu"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="counselor-username">Username (Optional)</Label>
                              <Input
                                id="counselor-username"
                                value={counselorForm.username}
                                onChange={(e) => setCounselorForm(prev => ({ ...prev, username: e.target.value }))}
                                placeholder="janesmith"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="counselor-university">University (Optional)</Label>
                              <Input
                                id="counselor-university"
                                value={counselorForm.university}
                                onChange={(e) => setCounselorForm(prev => ({ ...prev, university: e.target.value }))}
                                placeholder="Howard University"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="counselor-password">Password *</Label>
                              <Input
                                id="counselor-password"
                                type="password"
                                value={counselorForm.password}
                                onChange={(e) => setCounselorForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Minimum 6 characters"
                                required
                                minLength={6}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="counselor-confirm-password">Confirm Password *</Label>
                              <Input
                                id="counselor-confirm-password"
                                type="password"
                                value={counselorForm.confirmPassword}
                                onChange={(e) => setCounselorForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Re-enter password"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateCounselorOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={creatingCounselor}>
                              {creatingCounselor ? "Creating..." : "Create Counselor"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading users...
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>University</TableHead>
                          <TableHead>Email Verified</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Last Login</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No users found. Users will appear here once they register.
                            </TableCell>
                          </TableRow>
                        ) : (
                          allUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "default" : user.role === "counselor" ? "secondary" : "outline"}>
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.university || "—"}</TableCell>
                              <TableCell>
                                {user.isEmailVerified ? (
                                  <Badge className="bg-green-500">Verified</Badge>
                                ) : (
                                  <Badge variant="outline">Pending</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                              </TableCell>
                              <TableCell>
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

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
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No user analytics data available yet
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <ResourceAllocation timeFilter={timeFilter} />
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
                        {counselors.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No counselors registered yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          counselors.map((counselor) => (
                          <TableRow key={counselor.id}>
                            <TableCell>{counselor.name}</TableCell>
                            <TableCell>{getStatusBadge(counselor.status)}</TableCell>
                            <TableCell>{counselor.studentCount}</TableCell>
                            <TableCell>{counselor.specialty}</TableCell>
                          </TableRow>
                          ))
                        )}
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
                        {students.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No students requiring counseling at this time
                            </TableCell>
                          </TableRow>
                        ) : students
                          .filter(student => student.riskLevel !== "low")
                          .length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No students requiring counseling at this time
                            </TableCell>
                          </TableRow>
                        ) : (
                          students
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
                          ))
                        )}
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
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No chat communications data available. Communications will appear here once students and counselors start chatting.
                        </TableCell>
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
