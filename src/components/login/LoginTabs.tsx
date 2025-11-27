
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginTabsProps {
  loginType: "student" | "admin" | "counselor";
  onChangeLoginType: (type: "student" | "admin" | "counselor") => void;
  studentContent: ReactNode;
  adminContent: ReactNode;
  counselorContent?: ReactNode;
}

export const LoginTabs = ({ 
  loginType, 
  onChangeLoginType,
  studentContent,
  adminContent,
  counselorContent
}: LoginTabsProps) => {
  return (
    <Tabs 
      defaultValue="student" 
      value={loginType}
      onValueChange={(v) => onChangeLoginType(v as "student" | "admin" | "counselor")}
    >
      <TabsList className={`grid w-full ${counselorContent ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
        {counselorContent && <TabsTrigger value="counselor">Counselor</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="student">
        {studentContent}
      </TabsContent>
      
      <TabsContent value="admin">
        {adminContent}
      </TabsContent>
      
      {counselorContent && (
        <TabsContent value="counselor">
          {counselorContent}
        </TabsContent>
      )}
    </Tabs>
  );
};
