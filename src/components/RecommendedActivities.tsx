
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Meditation, HeartPulse, Smile } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    icon: Meditation,
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

const RecommendedActivities = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  return (
    <div className="space-y-3">
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
    </div>
  );
};

export default RecommendedActivities;
