import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ResourceAllocationProps {
  timeFilter?: string;
}

interface Resource {
  type: string;
  description: string;
  current: number;
  recommended: number;
  impact: string;
  priority: string;
}

interface BudgetItem {
  category: string;
  percentage: number;
  color: string;
}

interface HighImpactArea {
  title: string;
  description: string;
  color: string;
}

const ResourceAllocation = ({ timeFilter = 'month' }: ResourceAllocationProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [highImpactAreas, setHighImpactAreas] = useState<HighImpactArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [resourcesData, budgetData, areasData] = await Promise.all([
          api.getResourceAllocation(timeFilter).catch(() => []),
          api.getBudgetOptimization(timeFilter).catch(() => []),
          api.getHighImpactAreas(timeFilter).catch(() => [])
        ]);

        setResources(resourcesData || []);
        setBudgetItems(budgetData || []);
        setHighImpactAreas(areasData || []);
      } catch (error) {
        console.error("Error loading resource data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeFilter]);

  const handleAllocate = () => {
    toast.success("Resource allocation plan generated and ready for review");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="secondary">High</Badge>;
      case 'medium':
        return <Badge>Medium</Badge>;
      default:
        return <Badge>Low</Badge>;
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'red': 'bg-red-500',
      'green': 'bg-green-500',
      'blue': 'bg-blue-500',
      'purple': 'bg-purple-500',
      'yellow': 'bg-yellow-500',
      'amber': 'bg-amber-50 border-amber-200',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getAreaBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'amber': 'bg-amber-50 border-amber-200',
      'blue': 'bg-blue-50 border-blue-200',
      'green': 'bg-green-50 border-green-200',
      'red': 'bg-red-50 border-red-200',
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200';
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading resource allocation data...
            </div>
          ) : (
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
                {resources.length === 0 ? (
              <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No resource allocation data available. Recommendations will appear here once students start using the app.
                </TableCell>
              </TableRow>
                ) : (
                  resources.map((resource, index) => (
                    <TableRow key={index}>
                <TableCell>
                        <div className="font-medium">{resource.type}</div>
                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                </TableCell>
                      <TableCell>{resource.current}</TableCell>
                      <TableCell className="text-green-600">{resource.recommended}</TableCell>
                      <TableCell>{resource.impact}</TableCell>
                      <TableCell>{getPriorityBadge(resource.priority)}</TableCell>
              </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Based on user data from the selected time period
          </p>
          <Button onClick={handleAllocate} disabled={loading || resources.length === 0}>
            Generate Allocation Plan
          </Button>
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading budget data...
              </div>
            ) : budgetItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No budget optimization data available. Recommendations will appear here once students start using the app.
              </div>
            ) : (
              <div className="space-y-4">
                {budgetItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                      <div 
                        className={`h-full ${getColorClass(item.color)} rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                </div>
              </div>
                ))}
              </div>
            )}
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading high-impact areas...
              </div>
            ) : highImpactAreas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No high-impact areas identified yet. Recommendations will appear here once student data is available.
              </div>
            ) : (
              <div className="space-y-4">
                {highImpactAreas.map((area, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg ${getAreaBgColor(area.color)}`}
                  >
                    <h3 className="font-medium">{area.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                      {area.description}
                </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceAllocation;
