
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Heart, HeartPulse, Smile, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: any;
  iconClassName?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    title: "5-Minute Breathing",
    description: "Quick breathing exercise to reduce stress",
    icon: Heart,
    iconClassName: "text-mindPurple",
  },
  {
    id: "2",
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for today",
    icon: Book,
    iconClassName: "text-mindBlue",
  },
  {
    id: "3",
    title: "Mood Check-in",
    description: "Track how you're feeling right now",
    icon: Smile,
    iconClassName: "text-mindGreen",
  },
  {
    id: "4",
    title: "Stress Relief",
    description: "Quick techniques to manage overwhelming feelings",
    icon: HeartPulse,
    iconClassName: "text-mindOrange",
  },
];

// Campus events
const campusEvents = [
  {
    id: "event1",
    title: "Mindfulness Workshop",
    date: "May 5, 2025",
    location: "Student Center",
    points: 5
  },
  {
    id: "event2",
    title: "Mental Health Awareness Day",
    date: "May 10, 2025",
    location: "Main Quad",
    points: 10
  }
];

const RecommendedActivities = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showHealthCenter, setShowHealthCenter] = useState(false);
  const { toast } = useToast();
  
  const handleHealthCenterSchedule = () => {
    setShowHealthCenter(!showHealthCenter);
    toast({
      title: "Appointment Request Sent",
      description: "Howard University Health Center will contact you shortly to confirm your appointment.",
    });
  };

  const handleEventSignup = (eventName: string, points: number) => {
    toast({
      title: "Event Registration Successful",
      description: `You've registered for ${eventName}. You'll earn ${points} engagement points for attending.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Recommended Activities</h3>
      <div className="grid grid-cols-2 gap-3">
        {activities.map((activity) => (
          <Card 
            key={activity.id} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md", 
              selectedActivity === activity.id && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => setSelectedActivity(
              selectedActivity === activity.id ? null : activity.id
            )}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={cn(
                  "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3",
                  activity.iconClassName
                )}>
                  <activity.icon size={20} />
                </div>
                <h3 className="font-medium text-sm mb-1">{activity.title}</h3>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-medium mb-3">Howard University Health Center</h3>
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Calendar size={20} />
              </div>
              <h3 className="font-medium text-sm mb-1">Schedule a Visit</h3>
              <p className="text-xs text-muted-foreground mb-3">Book an appointment with mental health professionals</p>
              <button 
                onClick={handleHealthCenterSchedule}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                Request Appointment
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2">
        <h3 className="text-lg font-medium mb-3">Campus Mental Health Events</h3>
        <div className="space-y-3">
          {campusEvents.map(event => (
            <Card key={event.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
                  </div>
                  <div className="bg-secondary text-xs font-medium px-2 py-1 rounded-full">
                    {event.points} points
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => handleEventSignup(event.title, event.points)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs hover:bg-primary/20 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedActivities;
