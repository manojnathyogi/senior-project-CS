
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, LayoutGrid } from "lucide-react";

const LowFidelity = () => {
  const mockups = [
    {
      title: "Mood Tracker",
      description: "UI for daily mood logging using emoji sliders, text input, or voice notes",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      title: "Home Dashboard",
      description: "Central hub showing wellness summary, daily tips, and activity prompts",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      title: "Meditation Player",
      description: "Audio player with guided sessions for sleep, focus, anxiety, and breathing",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      title: "Peer Chat Room",
      description: "Anonymous group chat interface with topic filters and real-time messaging",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      title: "Health Center Appointments",
      description: "Interface for scheduling visits with Howard University Student Health Center",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      title: "Admin Dashboard",
      description: "Web-based interface for university health staff to monitor anonymized mental health trends",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600&h=400"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header />
      
      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-mindPurple" />
            <h1 className="text-xl font-bold">Low Fidelity Design</h1>
          </div>
        </div>

        <Card className="bg-secondary/30">
          <CardHeader className="pb-2">
            <CardTitle>MindEase Product Specification</CardTitle>
            <CardDescription>
              Visual mockups for the MindEase mental health companion app for Howard University
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              These wireframes represent the core screens of MindEase as outlined in the product specification document.
              The design focuses on simplicity, emotional safety, and accessibility.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockups.map((mockup, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 overflow-hidden bg-muted">
                <img 
                  src={mockup.imageUrl} 
                  alt={`${mockup.title} mockup`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{mockup.title}</CardTitle>
                <CardDescription>{mockup.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Design Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>Emotional Safety:</strong> Calming color palette with blues and purples, non-triggering imagery
              </li>
              <li>
                <strong>Accessibility:</strong> High contrast, WCAG 2.1 compliant design with large touch targets
              </li>
              <li>
                <strong>Simplicity:</strong> Intuitive navigation with clear iconography and minimal cognitive load
              </li>
              <li>
                <strong>Engagement:</strong> Visually rewarding progress tracking and achievement recognition
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
      
      <Navigation />
    </div>
  );
};

export default LowFidelity;
