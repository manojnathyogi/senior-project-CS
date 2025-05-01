
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

interface User {
  type: "student" | "admin";
  name: string;
  university?: string;
  email: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("mindease_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Uncomment this to force login before accessing the app
      // navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
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
            value="76%"
            trend="up"
            trendValue="5% from last week"
            icon={<Heart size={20} />}
          />
          
          <WellnessCard 
            title="Meditations"
            value="3"
            trend="neutral"
            trendValue="Same as last week"
            icon={<Calendar size={20} />}
          />
          
          <WellnessCard 
            title="Journal Entries"
            value="4"
            trend="down"
            trendValue="2 less than last week"
            icon={<MessageSquare size={20} />}
          />
        </div>
        
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
