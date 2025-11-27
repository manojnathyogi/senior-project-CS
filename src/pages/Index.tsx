
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MoodTracker from "@/components/MoodTracker";
import DailyTip from "@/components/DailyTip";
import RecommendedActivities from "@/components/RecommendedActivities";
import WellnessCard from "@/components/WellnessCard";
import CrisisButton from "@/components/CrisisButton";
import EngagementTracker from "@/components/EngagementTracker";
import CBTExercises from "@/components/CBTExercises";
import { Heart, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [moodStats, setMoodStats] = useState({
    averageMood: 0,
    meditationCount: 0,
    journalCount: 0,
  });
  
  useEffect(() => {
    if (user && user.role === "student") {
      // Load mood stats
      loadMoodStats();
    }
  }, [user]);
  
  const loadMoodStats = async () => {
    try {
      const stats = await api.getMoodStats(7);
      if (stats.logs && stats.logs.length > 0) {
        setMoodStats(prev => ({ ...prev, averageMood: Math.round(stats.average_mood) }));
      }
    } catch (error) {
      console.error("Error loading mood stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome to MindEase'}
              </h1>
            </div>
            
            {!user && (
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <p>Please <a href="/login" className="text-primary font-medium">sign in</a> to access all features.</p>
              </div>
            )}
            
            <DailyTip tip="Take a moment to breathe deeply when you feel overwhelmed. A few mindful breaths can help restore your sense of calm and focus." />
            
            <div className="grid grid-cols-3 gap-3">
              <WellnessCard 
                title="Mood Score"
                value={moodStats.averageMood > 0 ? `${moodStats.averageMood}%` : "—"}
                trend={moodStats.averageMood > 0 ? "neutral" : "neutral"}
                trendValue={moodStats.averageMood > 0 ? "Last 7 days" : "No data yet"}
                icon={<Heart size={20} />}
              />
              
              <WellnessCard 
                title="Meditations"
                value={moodStats.meditationCount.toString()}
                trend="neutral"
                trendValue="This week"
                icon={<Calendar size={20} />}
              />
              
              <WellnessCard 
                title="Journal Entries"
                value={moodStats.journalCount.toString()}
                trend="neutral"
                trendValue="This week"
                icon={<MessageSquare size={20} />}
              />
            </div>
          </>
        )}
        
        <MoodTracker />
        
        <CBTExercises />
        
        <EngagementTracker />
        
        <RecommendedActivities />
        
        <div className="pt-4">
          <CrisisButton />
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
