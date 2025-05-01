
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User } from "lucide-react";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  participants: number;
  tags: string[];
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  time: string;
  isCurrentUser: boolean;
}

const chatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "Exam Stress",
    description: "Support for handling test anxiety and study pressure",
    participants: 24,
    tags: ["Anxiety", "Academic"],
  },
  {
    id: "2",
    name: "Homesickness",
    description: "Connect with others missing home and family",
    participants: 15,
    tags: ["Loneliness", "Transition"],
  },
  {
    id: "3",
    name: "Burnout Recovery",
    description: "Tips and support for overcoming burnout",
    participants: 32,
    tags: ["Stress", "Self-care"],
  },
  {
    id: "4",
    name: "Social Anxiety",
    description: "Navigate campus social life and make connections",
    participants: 19,
    tags: ["Anxiety", "Social"],
  },
];

const dummyMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Has anyone tried meditation before exams? Does it help?",
    sender: "Anonymous Owl",
    time: "10:30 AM",
    isCurrentUser: false,
  },
  {
    id: "2",
    text: "Yes! I do 5 min breathing exercises before tests. It really helps calm my nerves.",
    sender: "Anonymous Fox",
    time: "10:32 AM",
    isCurrentUser: true,
  },
  {
    id: "3",
    text: "I find that taking short breaks during studying helps more than cramming non-stop. Anyone else?",
    sender: "Anonymous Deer",
    time: "10:35 AM",
    isCurrentUser: false,
  },
  {
    id: "4",
    text: "Pomodoro technique works really well for me - 25 min study, 5 min break.",
    sender: "Anonymous Rabbit",
    time: "10:38 AM",
    isCurrentUser: false,
  },
];

const PeerSupport = () => {
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "Anonymous Fox",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  if (!activeRoom) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Peer Support Rooms</h2>
          <span className="text-sm text-muted-foreground">All chats are anonymous</span>
        </div>
        
        <div className="space-y-3">
          {chatRooms.map((room) => (
            <Card 
              key={room.id} 
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => setActiveRoom(room)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">{room.description}</p>
                    
                    <div className="flex gap-2 mt-2">
                      {room.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User size={14} className="mr-1" />
                    <span>{room.participants}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-13rem)] flex flex-col">
      <Card className="flex-grow flex flex-col h-full">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{activeRoom.name}</CardTitle>
              <CardDescription className="mt-1">{activeRoom.description}</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveRoom(null)}
            >
              Back
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`flex justify-between text-xs mt-1 ${
                      message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    <span>{message.sender}</span>
                    <span>{message.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button size="icon" onClick={sendMessage}>
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            <MessageSquare size={12} className="inline mr-1" />
            Your identity is anonymous. Be kind and respectful.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PeerSupport;
