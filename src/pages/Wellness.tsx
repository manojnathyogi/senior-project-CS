
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MeditationPlayer from "@/components/MeditationPlayer";

const Wellness = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Wellness Center</h1>
        <p className="text-muted-foreground">Explore guided meditations and relaxation techniques</p>
        
        <MeditationPlayer />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Wellness;
