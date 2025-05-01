
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome back, Sam</h1>
        </div>
        
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
