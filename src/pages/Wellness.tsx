
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MeditationPlayer from "@/components/MeditationPlayer";
import CounselorChat from "@/components/CounselorChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wellness = () => {
  const [isChatRecommended, setIsChatRecommended] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Wellness Center</h1>
        
        {/* Fixed floating chat button */}
        {!showChat && (
          <Button 
            onClick={() => setShowChat(true)} 
            className="fixed z-10 bottom-20 right-4 rounded-full shadow-lg p-4 h-14 w-14"
            aria-label="Chat with Counselor"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
        
        {/* Full screen chat when active */}
        {showChat ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Counselor Chat</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowChat(false)}
              >
                Back to Wellness
              </Button>
            </div>
            <CounselorChat isRecommended={true} />
          </div>
        ) : (
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
        )}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Wellness;
