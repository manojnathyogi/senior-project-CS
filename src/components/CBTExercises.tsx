
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  completed: boolean;
}

const CBTExercises = () => {
  // Start with empty exercises for new users - data should come from backend
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      title: "Thought Challenging",
      description: "Identify and challenge negative thoughts that contribute to anxiety.",
      category: "Anxiety",
      duration: "10 min",
      completed: false,
    },
    {
      id: "2",
      title: "Behavioral Activation",
      description: "Plan and engage in positive activities to improve your mood.",
      category: "Depression",
      duration: "15 min",
      completed: false,
    },
    {
      id: "3",
      title: "Progressive Muscle Relaxation",
      description: "Tense and relax different muscle groups to reduce physical tension.",
      category: "Stress",
      duration: "8 min",
      completed: false, // Changed from true to false for new users
    },
  ]);

  const toggleCompleted = (id: string) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id 
        ? { ...exercise, completed: !exercise.completed } 
        : exercise
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-primary" />
          <CardTitle className="text-lg">Personalized CBT Exercises</CardTitle>
        </div>
        <CardDescription>
          Based on your mood patterns and self-assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3">
            {exercises.map(exercise => (
              <div 
                key={exercise.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{exercise.title}</h4>
                    <span className="text-xs bg-mindSoftPurple text-primary px-2 py-0.5 rounded-full">
                      {exercise.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                  <span className="text-xs text-muted-foreground">{exercise.duration}</span>
                </div>
                <Button 
                  variant={exercise.completed ? "outline" : "default"} 
                  size="sm"
                  onClick={() => toggleCompleted(exercise.id)}
                >
                  {exercise.completed ? "Completed" : "Start"}
                </Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="recommended" className="space-y-3">
            {exercises.filter(ex => !ex.completed).map(exercise => (
              <div 
                key={exercise.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{exercise.title}</h4>
                    <span className="text-xs bg-mindSoftPurple text-primary px-2 py-0.5 rounded-full">
                      {exercise.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                  <span className="text-xs text-muted-foreground">{exercise.duration}</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => toggleCompleted(exercise.id)}
                >
                  Start
                </Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-3">
            {exercises.filter(ex => ex.completed).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No completed exercises yet.</p>
                <p className="text-xs mt-1">Complete exercises to see them here!</p>
              </div>
            ) : (
              exercises.filter(ex => ex.completed).map(exercise => (
              <div 
                key={exercise.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{exercise.title}</h4>
                    <span className="text-xs bg-mindSoftPurple text-primary px-2 py-0.5 rounded-full">
                      {exercise.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                  <span className="text-xs text-muted-foreground">{exercise.duration}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleCompleted(exercise.id)}
                >
                  Completed
                </Button>
              </div>
            )))}
          </TabsContent>
        </Tabs>
        
        <Button variant="outline" className="w-full mt-4">View All Exercises</Button>
      </CardContent>
    </Card>
  );
};

export default CBTExercises;
