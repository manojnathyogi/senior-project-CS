
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import CampusEvents from "@/components/CampusEvents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Campus = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <div className="p-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-white border shadow-sm flex items-center justify-center">
          <img 
            src="https://placehold.co/200x200/png?text=HU" 
            alt="Howard University" 
            className="h-8 w-8 object-contain" 
          />
        </div>
        <h2 className="text-xl font-bold">Campus Mental Health</h2>
      </div>
      
      <main className="flex-1 px-4 py-2 space-y-6">
        <CampusEvents />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Campus;
