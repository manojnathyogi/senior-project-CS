
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import CampusEvents from "@/components/CampusEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Campus = () => {
  const [showHealthCenter, setShowHealthCenter] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  
  const handleHealthCenterSchedule = () => {
    setShowHealthCenter(!showHealthCenter);
    toast.success("Appointment Request Sent", {
      description: "Howard University Health Center will contact you shortly to confirm your appointment.",
    });
  };
  
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    toast.success("Event Created", {
      description: "Your event has been added to the campus calendar."
    });
    
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
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
        
        {/* Campus Events with Create Event Feature */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Campus Mental Health Events</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Campus Event</DialogTitle>
                  <DialogDescription>
                    Add a new mental health event to the campus calendar. Fill in all required fields.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title*</Label>
                    <Input 
                      id="title" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="e.g., Stress Management Workshop"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Brief description of the event"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date*</Label>
                      <Input 
                        id="date" 
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input 
                        id="time" 
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location*</Label>
                    <Input 
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder="e.g., Student Center, Room 203"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <CampusEvents />
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Campus;
