
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";

const CrisisButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 support for people in distress",
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "24/7 support via text message",
    },
    {
      name: "Campus Counseling Center",
      phone: "(555) 123-4567",
      description: "Weekdays 9AM-5PM, Emergency support available",
    },
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-red-500 hover:bg-red-600 text-white"
      >
        <Phone className="mr-2 h-4 w-4" /> Crisis Support
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crisis Support</DialogTitle>
            <DialogDescription>
              If you're experiencing a mental health emergency, please reach out to one of these resources immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            {emergencyResources.map((resource, i) => (
              <div key={i} className="bg-muted p-3 rounded-lg">
                <h3 className="font-medium">{resource.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{resource.description}</p>
                <a 
                  href={`tel:${resource.phone.replace(/\D/g,'')}`} 
                  className="flex items-center text-primary font-medium"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {resource.phone}
                </a>
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <DialogDescription className="text-xs text-center sm:text-left mb-4 sm:mb-0">
              For immediate danger to yourself or others, please call 911 or go to your nearest emergency room.
            </DialogDescription>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrisisButton;
