
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WellnessCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const WellnessCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
}: WellnessCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {trend && trendValue && (
              <p className={cn(
                "text-xs flex items-center mt-1",
                trend === "up" ? "text-green-600" : 
                trend === "down" ? "text-red-600" : 
                "text-gray-500"
              )}>
                <span>{trendValue}</span>
              </p>
            )}
          </div>
          
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessCard;
