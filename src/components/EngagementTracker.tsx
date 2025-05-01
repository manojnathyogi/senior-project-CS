
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EngagementMetric {
  title: string;
  current: number;
  target: number;
  icon: React.ComponentType<any>;
  color: string;
}

const EngagementTracker = () => {
  const metrics: EngagementMetric[] = [
    {
      title: "Weekly Engagement",
      current: 75,
      target: 100,
      icon: Heart,
      color: "text-mindPurple",
    },
    {
      title: "Event Attendance",
      current: 2,
      target: 5,
      icon: Calendar,
      color: "text-mindBlue",
    },
    {
      title: "Extra Credit Points",
      current: 15,
      target: 50,
      icon: Award,
      color: "text-mindGreen",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Howard Engagement Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`${metric.color}`}>
                    <metric.icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {metric.current}/{metric.target}
                </span>
              </div>
              <Progress value={(metric.current / metric.target) * 100} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-secondary/50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Extra Credit Information</h4>
          <p className="text-xs text-muted-foreground">
            Earn extra credit in participating courses by maintaining engagement with MindEase. 
            Reach 50 points to qualify for this semester's extra credit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementTracker;
