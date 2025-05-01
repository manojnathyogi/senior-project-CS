
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, PaperclipIcon, SmileIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "counselor" | "student";
  timestamp: string;
  read: boolean;
}

interface CounselorChatProps {
  isRecommended?: boolean;
}

const CounselorChat = ({ isRecommended = false }: CounselorChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [counselorOnline, setCounselorOnline] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I noticed your mood scores have been lower lately. How are you feeling today?",
      sender: "counselor",
      timestamp: "Today, 10:30 AM",
      read: true,
    },
  ]);

  useEffect(() => {
    // Simulate counselor availability changes
    const intervalId = setInterval(() => {
      setCounselorOnline(Math.random() > 0.3);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const studentMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "student",
      timestamp: "Just now",
      read: true,
    };

    setMessages([...messages, studentMessage]);
    setNewMessage("");

    // Simulate counselor response after a brief delay
    setTimeout(() => {
      const counselorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing. I understand this can be challenging. Would you like to schedule a face-to-face session to discuss further?",
        sender: "counselor",
        timestamp: "Just now",
        read: false,
      };
      setMessages(prev => [...prev, counselorResponse]);
    }, 3000);
  };

  if (!isRecommended && !isOpen) {
    return null;
  }

  if (!isOpen) {
    return (
      <Card className="border-primary/20 hover:border-primary transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-medium text-base">Counselor Chat Recommended</h3>
              <p className="text-sm text-muted-foreground">Connect with a university counselor</p>
            </div>
            <div className="ml-auto">
              <Button onClick={() => setIsOpen(true)}>Start Chat</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px] max-h-[70vh]">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://placehold.co/200x200/png?text=DC" />
              <AvatarFallback>DC</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">Dr. Carter</CardTitle>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${counselorOnline ? "bg-green-500" : "bg-gray-400"}`} />
                <CardDescription className="text-xs">
                  {counselorOnline ? "Online" : "Away"}
                </CardDescription>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Minimize
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "student" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "student"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <div
                className={`flex justify-between text-xs mt-1 ${
                  message.sender === "student" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                <span>{message.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex items-center gap-2 w-full">
          <Button variant="ghost" size="icon" className="rounded-full">
            <PaperclipIcon size={20} />
          </Button>
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
          <Button variant="ghost" size="icon" className="rounded-full">
            <SmileIcon size={20} />
          </Button>
          <Button onClick={handleSendMessage} size="icon" className="rounded-full">
            <Send size={20} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CounselorChat;
