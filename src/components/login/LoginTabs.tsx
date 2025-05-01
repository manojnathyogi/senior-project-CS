
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginTabsProps {
  loginType: "student" | "admin";
  onChangeLoginType: (type: "student" | "admin") => void;
  studentContent: ReactNode;
  adminContent: ReactNode;
}

export const LoginTabs = ({ 
  loginType, 
  onChangeLoginType,
  studentContent,
  adminContent
}: LoginTabsProps) => {
  return (
    <Tabs 
      defaultValue="student" 
      value={loginType}
      onValueChange={(v) => onChangeLoginType(v as "student" | "admin")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      
      <TabsContent value="student">
        {studentContent}
      </TabsContent>
      
      <TabsContent value="admin">
        {adminContent}
      </TabsContent>
    </Tabs>
  );
};
