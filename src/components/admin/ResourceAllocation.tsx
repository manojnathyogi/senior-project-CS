
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ResourceAllocation = () => {
  const handleAllocate = () => {
    toast.success("Resource allocation plan generated and ready for review");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation Suggestions</CardTitle>
          <CardDescription>
            AI-generated recommendations based on user needs and engagement patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource Type</TableHead>
                <TableHead>Current Allocation</TableHead>
                <TableHead>Recommended</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Crisis Counselors</div>
                  <div className="text-sm text-muted-foreground">On-call mental health professionals</div>
                </TableCell>
                <TableCell>3</TableCell>
                <TableCell className="text-green-600">5</TableCell>
                <TableCell>High</TableCell>
                <TableCell>
                  <Badge variant="destructive">Urgent</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Meditation Workshop</div>
                  <div className="text-sm text-muted-foreground">Weekly guided sessions</div>
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell className="text-green-600">2</TableCell>
                <TableCell>Medium</TableCell>
                <TableCell>
                  <Badge>Medium</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Peer Support Training</div>
                  <div className="text-sm text-muted-foreground">Certification program</div>
                </TableCell>
                <TableCell>2</TableCell>
                <TableCell className="text-green-600">4</TableCell>
                <TableCell>High</TableCell>
                <TableCell>
                  <Badge variant="secondary">High</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">CBT Specialists</div>
                  <div className="text-sm text-muted-foreground">Therapists with CBT expertise</div>
                </TableCell>
                <TableCell>2</TableCell>
                <TableCell className="text-green-600">3</TableCell>
                <TableCell>Medium</TableCell>
                <TableCell>
                  <Badge>Medium</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Based on user data from the past 30 days
          </p>
          <Button onClick={handleAllocate}>Generate Allocation Plan</Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Optimization</CardTitle>
            <CardDescription>
              Recommended budget distribution based on student needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Crisis Response</span>
                  <span className="text-sm text-muted-foreground">35%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-red-500 rounded-full w-[35%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Preventative Resources</span>
                  <span className="text-sm text-muted-foreground">25%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full w-[25%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Peer Support Programs</span>
                  <span className="text-sm text-muted-foreground">20%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-blue-500 rounded-full w-[20%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Educational Workshops</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-purple-500 rounded-full w-[15%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Digital Resources</span>
                  <span className="text-sm text-muted-foreground">5%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full w-[5%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>High-Impact Areas</CardTitle>
            <CardDescription>
              Recommended focus areas based on student data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                <h3 className="font-medium">Finals Week Support</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Data shows 68% increase in anxiety during exam periods. Recommend temporary increase in counseling hours and drop-in sessions.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h3 className="font-medium">Freshman Orientation Program</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  First-year students show highest need for mental health resources. Recommend dedicated onboarding workshops.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <h3 className="font-medium">International Student Support</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  International students using app 30% less than domestic students. Recommend targeted outreach and culturally sensitive resources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceAllocation;
