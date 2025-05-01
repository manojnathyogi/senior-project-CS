
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import CampusEvents from "@/components/CampusEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

const Campus = () => {
  const [showHealthCenter, setShowHealthCenter] = useState(false);
  
  const handleHealthCenterSchedule = () => {
    setShowHealthCenter(!showHealthCenter);
    toast.success("Appointment Request Sent", {
      description: "Howard University Health Center will contact you shortly to confirm your appointment.",
    });
  };
  
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
        {/* University Health Center Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Howard University Health Center</h3>
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                  <Calendar size={20} />
                </div>
                <h3 className="font-medium text-sm mb-1">Schedule a Visit</h3>
                <p className="text-xs text-muted-foreground mb-3">Book an appointment with mental health professionals</p>
                <button 
                  onClick={handleHealthCenterSchedule}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Request Appointment
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <CampusEvents />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Campus;
