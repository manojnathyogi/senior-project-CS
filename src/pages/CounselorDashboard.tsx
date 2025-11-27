
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Bell, AlertCircle, Calendar, User, Settings, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  lastActive: string;
  moodScore: number;
  riskLevel: "low" | "medium" | "high";
  adminRecommended: boolean;
  hasUnread: boolean;
}

interface ChatMessage {
  id: string;
  studentId: string;
  text: string;
  sender: "counselor" | "student";
  timestamp: string;
  read: boolean;
}

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeStudent, setActiveStudent] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/counselor-login", { replace: true });
      } else if (user.role !== "counselor") {
        toast.error("Access denied. Counselor access required.");
        navigate("/login", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);
  
  const handleLogout = async () => {
    await signOut();
    navigate("/counselor-login");
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
  
  const handleSendMessage = () => {
    if (!activeStudent || !newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      studentId: activeStudent,
      text: newMessage,
      sender: "counselor",
      timestamp: "Just now",
      read: false,
    };
    
    setMessages(prev => ({
      ...prev,
      [activeStudent]: [...(prev[activeStudent] || []), newMsg],
    }));
    
    setNewMessage("");
    
    // Mark student messages as read
    if (activeStudent) {
      setStudents(prev => 
        prev.map(student => 
          student.id === activeStudent 
            ? { ...student, hasUnread: false }
            : student
        )
      );
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== "counselor") {
    return null; // Will redirect via useEffect
  }
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user.name) return "C";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">MindEase Counselor Portal</h1>
              <p className="text-sm text-muted-foreground">{user.name || "Counselor"} • {user.university || "University Counseling Center"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium hidden md:inline-block">{user.name}</span>
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full" 
              onClick={() => window.open("tel:988", "_self")}
              aria-label="Emergency Call"
            >
              <Phone size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar with student list */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Users size={18} />
              <span>Student Cases</span>
            </h2>
          </div>
          
          <div className="p-2">
            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No student cases assigned yet.</p>
                <p className="text-xs mt-1">Students requiring counseling will appear here.</p>
              </div>
            ) : (
              students.map(student => (
              <div 
                key={student.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-slate-50 ${
                  activeStudent === student.id ? "bg-slate-50 border border-slate-200" : ""
                }`}
                onClick={() => setActiveStudent(student.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  {student.hasUnread && (
                    <Badge className="bg-primary h-2 w-2 rounded-full p-0" />
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>Last active: {student.lastActive}</span>
                  <span>Mood: {student.moodScore}%</span>
                </div>
                
                <div className="flex justify-between mt-2">
                  {getRiskBadge(student.riskLevel)}
                  {student.adminRecommended && (
                    <Badge variant="outline" className="border-amber-500 text-amber-700">
                      <AlertCircle size={12} className="mr-1" />
                      Admin Recommended
                    </Badge>
                  )}
                </div>
              </div>
            ))
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {activeStudent ? (
            <>
              {/* Student info header */}
              <div className="p-4 border-b bg-white">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {students.find(s => s.id === activeStudent)?.name}
                    </h2>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <User size={14} className="mr-1" />
                        Student
                      </span>
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Last session: 2 weeks ago
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button variant="outline" size="sm">Schedule Session</Button>
                  </div>
                </div>
              </div>
              
              {/* Chat area */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                {messages[activeStudent] && messages[activeStudent].length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">No messages yet.</p>
                      <p className="text-xs mt-1">Start a conversation with this student.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1">
                    {messages[activeStudent]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "counselor" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "counselor"
                            ? "bg-primary text-primary-foreground"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div
                          className={`flex justify-between text-xs mt-1 ${
                            message.sender === "counselor" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <MessageSquare size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium">Select a student to start messaging</h3>
                <p className="text-muted-foreground">
                  Choose a student from the list to view their case details and chat history
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CounselorDashboard;
