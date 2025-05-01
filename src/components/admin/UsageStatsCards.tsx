
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface UsageStatsCardsProps {
  timeFilter: string;
}

const UsageStatsCards = ({ timeFilter }: UsageStatsCardsProps) => {
  // Demo stats based on time filter
  const getStats = () => {
    switch (timeFilter) {
      case "day":
        return {
          activeUsers: 87,
          sessionTime: 12,
          completedExercises: 49,
          riskAlerts: 3,
          trends: {
            activeUsers: 5,
            sessionTime: -2,
            completedExercises: 8,
            riskAlerts: 0
          }
        };
      case "week":
        return {
          activeUsers: 245,
          sessionTime: 15,
          completedExercises: 189,
          riskAlerts: 12,
          trends: {
            activeUsers: 12,
            sessionTime: 4,
            completedExercises: 15,
            riskAlerts: -3
          }
        };
      case "month":
        return {
          activeUsers: 683,
          sessionTime: 18,
          completedExercises: 542,
          riskAlerts: 29,
          trends: {
            activeUsers: 8,
            sessionTime: 2,
            completedExercises: 10,
            riskAlerts: -5
          }
        };
      default:
        return {
          activeUsers: 245,
          sessionTime: 15,
          completedExercises: 189,
          riskAlerts: 12,
          trends: {
            activeUsers: 12,
            sessionTime: 4,
            completedExercises: 15,
            riskAlerts: -3
          }
        };
    }
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <div className={`flex items-center text-xs ${stats.trends.activeUsers >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stats.trends.activeUsers >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
            {Math.abs(stats.trends.activeUsers)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {timeFilter === "day" ? "students today" : timeFilter === "week" ? "students this week" : "students this month"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
          <div className={`flex items-center text-xs ${stats.trends.sessionTime >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stats.trends.sessionTime >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
            {Math.abs(stats.trends.sessionTime)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sessionTime} min</div>
          <p className="text-xs text-muted-foreground">
            compared to previous {timeFilter}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed Exercises</CardTitle>
          <div className={`flex items-center text-xs ${stats.trends.completedExercises >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stats.trends.completedExercises >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
            {Math.abs(stats.trends.completedExercises)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedExercises}</div>
          <p className="text-xs text-muted-foreground">
            {timeFilter === "day" ? "exercises today" : timeFilter === "week" ? "exercises this week" : "exercises this month"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
          <div className={`flex items-center text-xs ${stats.trends.riskAlerts <= 0 ? "text-green-500" : "text-red-500"}`}>
            {stats.trends.riskAlerts <= 0 ? <ArrowDownIcon className="h-4 w-4 mr-1" /> : <ArrowUpIcon className="h-4 w-4 mr-1" />}
            {Math.abs(stats.trends.riskAlerts)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.riskAlerts}</div>
          <p className="text-xs text-muted-foreground">
            students requiring attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageStatsCards;
