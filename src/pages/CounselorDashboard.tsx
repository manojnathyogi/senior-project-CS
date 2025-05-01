
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Bell, AlertCircle, Calendar, User, Settings, Phone } from "lucide-react";

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
  const [user, setUser] = useState<any>(null);
  const [activeStudent, setActiveStudent] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alex Johnson",
      lastActive: "2 hours ago",
      moodScore: 45,
      riskLevel: "high",
      adminRecommended: true,
      hasUnread: true,
    },
    {
      id: "2",
      name: "Jordan Lee",
      lastActive: "Yesterday",
      moodScore: 68,
      riskLevel: "medium",
      adminRecommended: true,
      hasUnread: false,
    },
    {
      id: "3",
      name: "Taylor Smith",
      lastActive: "3 days ago",
      moodScore: 82,
      riskLevel: "low",
      adminRecommended: false,
      hasUnread: false,
    },
  ]);
  
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "1": [
      {
        id: "1-1",
        studentId: "1",
        text: "I've been feeling overwhelmed lately with all my classes.",
        sender: "student",
        timestamp: "Yesterday, 3:45 PM",
        read: true,
      },
      {
        id: "1-2",
        studentId: "1",
        text: "I understand that feeling. Would you like to talk about some strategies to manage your workload?",
        sender: "counselor",
        timestamp: "Yesterday, 4:00 PM",
        read: true,
      },
      {
        id: "1-3",
        studentId: "1",
        text: "Yes, I think that would help. I'm struggling to keep up with everything.",
        sender: "student",
        timestamp: "Today, 9:15 AM",
        read: false,
      },
    ],
    "2": [
      {
        id: "2-1",
        studentId: "2",
        text: "The meditation exercises have been helping, but I still have trouble sleeping.",
        sender: "student",
        timestamp: "Last week",
        read: true,
      },
      {
        id: "2-2",
        studentId: "2",
        text: "That's good progress! Let's discuss some additional techniques specifically for sleep improvement.",
        sender: "counselor",
        timestamp: "Last week",
        read: true,
      },
    ],
    "3": [],
  });
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.type === "counselor") {
        setUser(parsedUser);
      } else {
        navigate("/counselor-login");
      }
    } else {
      navigate("/counselor-login");
    }
  }, [navigate]);
  
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">MindEase Counselor Portal</h1>
              <p className="text-sm text-muted-foreground">{user.university || "University Counseling Center"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full" 
              onClick={() => window.open("tel:988", "_self")}
              aria-label="Emergency Call"
            >
              <Phone size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell size={20} />
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="https://placehold.co/200x200/png?text=DC" />
              <AvatarFallback>DC</AvatarFallback>
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
            {students.map(student => (
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
            ))}
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
