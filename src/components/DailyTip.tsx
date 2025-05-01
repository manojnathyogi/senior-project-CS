
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface DailyTipProps {
  tip: string;
}

const DailyTip = ({ tip }: DailyTipProps) => {
  return (
    <Card className="bg-gradient-to-br from-mindSoftPurple to-mindSoftBlue border-none">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
            <Heart size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Daily Wellness Tip</h3>
            <p className="text-sm">{tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTip;
