
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { api } from "@/lib/api";

interface MentalHealthTrendsProps {
  timeFilter: string;
}

const MentalHealthTrends = ({ timeFilter }: MentalHealthTrendsProps) => {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [campusData, setCampusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [mood, usage, risk, campus] = await Promise.all([
          api.getMoodMetrics(timeFilter).catch(() => []),
          api.getFeatureUsage(timeFilter).catch(() => []),
          api.getRiskAssessment(timeFilter).catch(() => []),
          api.getCampusDistribution(timeFilter).catch(() => [])
        ]);

        setMoodData(mood || []);
        setUsageData(usage || []);
        setRiskData(risk || []);
        setCampusData(campus || []);
      } catch (error) {
        console.error("Error loading trends data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeFilter]);
  
  // Colors for charts
  const COLORS = {
    anxiety: "#8b5cf6",
    depression: "#6366f1",
    stress: "#ec4899",
    wellness: "#10b981",
    mood: "#3b82f6",
    meditation: "#8b5cf6",
    cbt: "#14b8a6",
    journal: "#f59e0b"
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mood">
        <TabsList>
          <TabsTrigger value="mood">Mood Metrics</TabsTrigger>
          <TabsTrigger value="usage">Feature Usage</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="campus">Campus Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Metrics Over Time</CardTitle>
              <CardDescription>
                Tracking anxiety, depression, stress levels and overall wellness scores
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {moodData.every(d => d.anxiety === 0 && d.depression === 0 && d.stress === 0 && d.wellness === 0) ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <p className="text-lg font-medium">No data available</p>
                    <p className="text-sm mt-1">Mental health metrics will appear here once students start using the app</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={moodData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="anxiety" stroke={COLORS.anxiety} />
                    <Line type="monotone" dataKey="depression" stroke={COLORS.depression} />
                    <Line type="monotone" dataKey="stress" stroke={COLORS.stress} />
                    <Line type="monotone" dataKey="wellness" stroke={COLORS.wellness} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Distribution</CardTitle>
              <CardDescription>
                Tracking how students are engaging with different app features
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <p className="text-lg font-medium">Loading...</p>
                  </div>
                </div>
              ) : usageData.length === 0 || usageData.every(d => d.mood === 0 && d.meditation === 0 && d.cbt === 0 && d.journal === 0) ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <p className="text-lg font-medium">No data available</p>
                    <p className="text-sm mt-1">Feature usage data will appear here once students start using the app</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mood" fill={COLORS.mood} name="Mood Tracker" />
                    <Bar dataKey="meditation" fill={COLORS.meditation} name="Meditation" />
                    <Bar dataKey="cbt" fill={COLORS.cbt} name="CBT Exercises" />
                    <Bar dataKey="journal" fill={COLORS.journal} name="Journal" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Risk Assessment</CardTitle>
              <CardDescription>
                Distribution of students by mental health risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <p className="text-lg font-medium">Loading...</p>
                    </div>
                  </div>
                ) : riskData.length === 0 || riskData.every(d => d.value === 0) ? (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <p className="text-lg font-medium">No data available</p>
                      <p className="text-sm mt-1">Risk assessment data will appear here once students start using the app</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={140}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}%`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campus" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Campus</CardTitle>
              <CardDescription>
                App usage distribution across partner universities
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <p className="text-lg font-medium">Loading...</p>
                  </div>
                </div>
              ) : campusData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <p className="text-lg font-medium">No campus data available</p>
                    <p className="text-sm mt-1">Campus usage data will appear here once students start using the app</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={campusData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Usage %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentalHealthTrends;
