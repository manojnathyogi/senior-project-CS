
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeditationSession {
  id: string;
  title: string;
  duration: string;
  category: string;
  active?: boolean;
}

const meditationSessions: MeditationSession[] = [
  {
    id: "1",
    title: "Calm Breathing",
    duration: "5 min",
    category: "Anxiety",
    active: true,
  },
  {
    id: "2",
    title: "Mindful Focus",
    duration: "10 min",
    category: "Focus",
  },
  {
    id: "3",
    title: "Deep Sleep",
    duration: "15 min",
    category: "Sleep",
  },
  {
    id: "4",
    title: "Stress Relief",
    duration: "8 min",
    category: "Stress",
  },
];

const MeditationPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSession, setActiveSession] = useState(meditationSessions[0]);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  // Simulation for demo purposes - in a real app this would be controlled by the audio player
  useState(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    }

    return () => clearInterval(interval);
  });

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-mindPurple/20 to-mindBlue/20 border-none overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div
              className={cn(
                "w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-mindPurple to-mindBlue flex items-center justify-center mb-6",
                isPlaying ? "animate-pulse-soft" : ""
              )}
            >
              <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-mindPurple to-mindBlue">
                  ME
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-1">{activeSession.title}</h3>
            <p className="text-sm text-center text-gray-500 mb-4">
              {activeSession.category} • {activeSession.duration}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div
                className="bg-gradient-to-r from-mindPurple to-mindBlue h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  // Previous track logic
                }}
              >
                <SkipBack size={18} />
              </Button>
              <Button
                onClick={togglePlay}
                size="icon"
                className="h-12 w-12 rounded-full bg-gradient-to-br from-mindPurple to-mindBlue"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  // Next track logic
                }}
              >
                <SkipForward size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Recommended Sessions</h3>
        <div className="space-y-2">
          {meditationSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSession(session)}
              className={cn(
                "flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors",
                session.id === activeSession.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100"
              )}
            >
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {session.category} • {session.duration}
                </p>
              </div>
              {session.id === activeSession.id && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeditationPlayer;
