
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MoodTracker = () => {
  const [moodValue, setMoodValue] = useState(50);
  const [moodNote, setMoodNote] = useState("");

  const getMoodEmoji = () => {
    if (moodValue < 30) return <Frown className="h-10 w-10 text-mindRed" />;
    if (moodValue < 70) return <Meh className="h-10 w-10 text-mindYellow" />;
    return <Smile className="h-10 w-10 text-mindGreen" />;
  };

  const getMoodText = () => {
    if (moodValue < 30) return "Not good";
    if (moodValue < 70) return "Okay";
    return "Great!";
  };

  const getSliderBackground = () => {
    const percentage = moodValue;
    return `linear-gradient(to right, #EB5757 0%, #F2C94C 50%, #6FCF97 100%)`;
  };

  const handleSubmit = () => {
    toast.success("Mood logged successfully!");
    setMoodNote("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2 rounded-full bg-background">{getMoodEmoji()}</div>
          <span className="text-sm font-medium">{getMoodText()}</span>
        </div>
        
        <div className="w-full px-1 py-4">
          <input
            type="range"
            min={0}
            max={100}
            value={moodValue}
            onChange={(e) => setMoodValue(parseInt(e.target.value))}
            className={cn(
              "w-full h-2 rounded-lg appearance-none cursor-pointer mood-slider",
            )}
            style={{ background: getSliderBackground() }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Bad</span>
            <span>Good</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="mood-notes" className="text-sm font-medium">
            Want to share more? (optional)
          </label>
          <Textarea
            id="mood-notes"
            placeholder="Write how you're feeling..."
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
        
        <Button onClick={handleSubmit} className="w-full">
          Log My Mood
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
