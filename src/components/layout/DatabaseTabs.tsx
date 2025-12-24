"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StudentsTab } from "@/components/tabs/StudentsTab";
import { TeachersTab } from "@/components/tabs/TeachersTab";
import { DepartmentsTab } from "@/components/tabs/DepartmentsTab";
import { CoursesTab } from "@/components/tabs/CoursesTab";
import { EnrollmentsTab } from "@/components/tabs/EnrollmentsTab";
import { PaymentsTab } from "@/components/tabs/PaymentsTab";
import { BooksTab } from "@/components/tabs/BooksTab";
import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  ClipboardList,
  CreditCard,
  Library,
} from "lucide-react";

interface Department {
  DepartmentID: number;
  DName: string;
}

interface Teacher {
  TeacherSSN: string;
  TName: string;
}

interface DatabaseTabsProps {
  departments: Department[];
  teachers: Teacher[];
  onDepartmentsChange: () => void;
  onTeachersChange: () => void;
}

export function DatabaseTabs({ 
  departments, 
  teachers, 
  onDepartmentsChange, 
  onTeachersChange 
}: DatabaseTabsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Teachers</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Depts</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Enroll</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">Books</span>
            </TabsTrigger>
          </TabsList>

          <Separator className="mb-6" />

          <TabsContent value="students">
            <StudentsTab teachers={teachers} />
          </TabsContent>
          
          <TabsContent value="teachers">
            <TeachersTab departments={departments} onTeachersChange={onTeachersChange} />
          </TabsContent>
          
          <TabsContent value="departments">
            <DepartmentsTab onDepartmentsChange={onDepartmentsChange} />
          </TabsContent>
          
          <TabsContent value="courses">
            <CoursesTab departments={departments} teachers={teachers} />
          </TabsContent>
          
          <TabsContent value="enrollments">
            <EnrollmentsTab />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsTab />
          </TabsContent>
          
          <TabsContent value="books">
            <BooksTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
