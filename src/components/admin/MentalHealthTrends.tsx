
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

interface MentalHealthTrendsProps {
  timeFilter: string;
}

const MentalHealthTrends = ({ timeFilter }: MentalHealthTrendsProps) => {
  // Demo data for visualizations
  const getMoodData = () => {
    if (timeFilter === "day") {
      return [
        { name: "6am", anxiety: 30, depression: 20, stress: 45, wellness: 60 },
        { name: "9am", anxiety: 40, depression: 25, stress: 50, wellness: 55 },
        { name: "12pm", anxiety: 35, depression: 30, stress: 40, wellness: 60 },
        { name: "3pm", anxiety: 50, depression: 40, stress: 45, wellness: 50 },
        { name: "6pm", anxiety: 45, depression: 35, stress: 40, wellness: 55 },
        { name: "9pm", anxiety: 30, depression: 25, stress: 30, wellness: 65 },
      ];
    } else {
      return [
        { name: "Mon", anxiety: 30, depression: 20, stress: 45, wellness: 60 },
        { name: "Tue", anxiety: 40, depression: 25, stress: 50, wellness: 55 },
        { name: "Wed", anxiety: 35, depression: 30, stress: 40, wellness: 60 },
        { name: "Thu", anxiety: 50, depression: 40, stress: 45, wellness: 50 },
        { name: "Fri", anxiety: 45, depression: 35, stress: 40, wellness: 55 },
        { name: "Sat", anxiety: 30, depression: 25, stress: 30, wellness: 65 },
        { name: "Sun", anxiety: 25, depression: 20, stress: 25, wellness: 70 },
      ];
    }
  };
  
  const getUsageData = () => {
    if (timeFilter === "day") {
      return [
        { name: "6am", mood: 5, meditation: 2, cbt: 1, journal: 0 },
        { name: "9am", mood: 15, meditation: 8, cbt: 5, journal: 3 },
        { name: "12pm", mood: 10, meditation: 12, cbt: 7, journal: 5 },
        { name: "3pm", mood: 8, meditation: 6, cbt: 10, journal: 7 },
        { name: "6pm", mood: 20, meditation: 10, cbt: 8, journal: 12 },
        { name: "9pm", mood: 25, meditation: 15, cbt: 12, journal: 15 },
      ];
    } else {
      return [
        { name: "Mon", mood: 25, meditation: 18, cbt: 12, journal: 15 },
        { name: "Tue", mood: 30, meditation: 20, cbt: 15, journal: 12 },
        { name: "Wed", mood: 35, meditation: 25, cbt: 20, journal: 18 },
        { name: "Thu", mood: 40, meditation: 22, cbt: 18, journal: 20 },
        { name: "Fri", mood: 35, meditation: 18, cbt: 15, journal: 16 },
        { name: "Sat", mood: 20, meditation: 35, cbt: 10, journal: 8 },
        { name: "Sun", mood: 15, meditation: 30, cbt: 8, journal: 10 },
      ];
    }
  };

  const getRiskData = () => {
    return [
      { name: "Low Risk", value: 70, color: "#4ade80" },
      { name: "Medium Risk", value: 20, color: "#facc15" },
      { name: "High Risk", value: 10, color: "#f87171" },
    ];
  };
  
  const getCampusData = () => {
    return [
      { name: "Howard", value: 40 },
      { name: "Georgetown", value: 25 },
      { name: "Maryland", value: 20 },
      { name: "American", value: 15 },
    ];
  };

  const moodData = getMoodData();
  const usageData = getUsageData();
  const riskData = getRiskData();
  const campusData = getCampusData();
  
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentalHealthTrends;
