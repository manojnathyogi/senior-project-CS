
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { api } from "@/lib/api";

interface UsageStatsCardsProps {
  timeFilter: string;
}

const UsageStatsCards = ({ timeFilter }: UsageStatsCardsProps) => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    sessionTime: 0,
    completedExercises: 0,
    riskAlerts: 0,
    trends: {
      activeUsers: 0,
      sessionTime: 0,
      completedExercises: 0,
      riskAlerts: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await api.getDashboardStats(timeFilter);
        setStats({
          activeUsers: data.activeUsers || 0,
          sessionTime: data.sessionTime || 0,
          completedExercises: data.completedExercises || 0,
          riskAlerts: data.riskAlerts || 0,
          trends: data.trends || {
            activeUsers: 0,
            sessionTime: 0,
            completedExercises: 0,
            riskAlerts: 0
          }
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        // Keep default zero values on error
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [timeFilter]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          {stats.trends.activeUsers !== 0 && (
            <div className={`flex items-center text-xs ${stats.trends.activeUsers >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.trends.activeUsers >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(stats.trends.activeUsers)}%
            </div>
          )}
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
          {stats.trends.sessionTime !== 0 && (
            <div className={`flex items-center text-xs ${stats.trends.sessionTime >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.trends.sessionTime >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(stats.trends.sessionTime)}%
            </div>
          )}
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
          {stats.trends.completedExercises !== 0 && (
            <div className={`flex items-center text-xs ${stats.trends.completedExercises >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.trends.completedExercises >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(stats.trends.completedExercises)}%
            </div>
          )}
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
          {stats.trends.riskAlerts !== 0 && (
            <div className={`flex items-center text-xs ${stats.trends.riskAlerts <= 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.trends.riskAlerts <= 0 ? <ArrowDownIcon className="h-4 w-4 mr-1" /> : <ArrowUpIcon className="h-4 w-4 mr-1" />}
              {Math.abs(stats.trends.riskAlerts)}%
            </div>
          )}
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
