
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  registered: boolean;
}

const CampusEvents = () => {
  // Start with no registrations for new users - data should come from backend
  const [events, setEvents] = useState<CampusEvent[]>([
    {
      id: "1",
      title: "Stress Management Workshop",
      description: "Learn practical techniques to manage academic stress and anxiety.",
      date: "May 10, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Student Health Center, Room 203",
      category: "Workshop",
      attendees: 24,
      registered: false // Changed from false (already correct)
    },
    {
      id: "2",
      title: "Mindfulness Meditation Group",
      description: "Weekly group meditation session led by Dr. Williams. Open to all students.",
      date: "May 5, 2025",
      time: "5:30 PM - 6:30 PM",
      location: "Wellness Center, Main Hall",
      category: "Group Session",
      attendees: 12,
      registered: false // Changed from true to false for new users
    },
    {
      id: "3",
      title: "Mental Health Awareness Fair",
      description: "Campus-wide event with booths, resources, and guest speakers.",
      date: "May 15, 2025",
      time: "11:00 AM - 3:00 PM",
      location: "University Yard",
      category: "Event",
      attendees: 158,
      registered: false
    },
  ]);

  const handleRegistration = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const newStatus = !event.registered;
        
        if (newStatus) {
          toast.success("Successfully registered for event", {
            description: "You'll receive a reminder notification before the event"
          });
        } else {
          toast.info("Canceled event registration");
        }
        
        return {
          ...event,
          registered: newStatus,
          attendees: newStatus ? event.attendees + 1 : event.attendees - 1
        };
      }
      return event;
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'workshop':
        return 'bg-mindPurple text-white';
      case 'group session':
        return 'bg-mindGreen text-primary-foreground';
      case 'event':
        return 'bg-mindBlue text-white';
      default:
        return 'bg-mindSoftPurple text-primary';
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`mb-2 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <CardDescription className="mb-4">{event.description}</CardDescription>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <MapPin size={14} className="text-gray-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-500" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant={event.registered ? "outline" : "default"} 
              className="w-full" 
              onClick={() => handleRegistration(event.id)}
            >
              {event.registered ? "Cancel Registration" : "Register"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CampusEvents;
