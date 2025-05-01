
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MeditationPlayer from "@/components/MeditationPlayer";
import CounselorChat from "@/components/CounselorChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";

const Wellness = () => {
  const [isChatRecommended, setIsChatRecommended] = useState(true);
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Wellness Center</h1>
        
        <Tabs defaultValue="meditation">
          <TabsList className="w-full">
            <TabsTrigger value="meditation" className="flex-1">Meditation</TabsTrigger>
            <TabsTrigger value="mood" className="flex-1">Mood Tracker</TabsTrigger>
            <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meditation" className="pt-4">
            <p className="text-muted-foreground mb-4">Explore guided meditations and relaxation techniques</p>
            <MeditationPlayer />
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-6 pt-4">
            <MoodTracker />
            
            {/* Counselor Chat component appears here if recommended */}
            <CounselorChat isRecommended={isChatRecommended} />
          </TabsContent>
          
          <TabsContent value="resources" className="pt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">Mental wellness resources and support materials</p>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Understanding Anxiety</h3>
                <p className="text-sm text-muted-foreground">Learn about common anxiety triggers and management techniques.</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Mindfulness Practice Guide</h3>
                <p className="text-sm text-muted-foreground">Step-by-step guide to developing a mindfulness routine.</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Sleep Hygiene Tips</h3>
                <p className="text-sm text-muted-foreground">Improve your sleep quality with these evidence-based strategies.</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Wellness;
