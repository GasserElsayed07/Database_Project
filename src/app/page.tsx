"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { DatabaseTabs } from "@/components/layout/DatabaseTabs";
import { StatsCards } from "@/components/layout/StatsCards";

interface Department {
  DepartmentID: number;
  DName: string;
}

interface Teacher {
  TeacherSSN: string;
  TName: string;
}

export default function Home() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
  }, [fetchDepartments, fetchTeachers]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DatabaseTabs
          departments={departments}
          teachers={teachers}
          onDepartmentsChange={fetchDepartments}
          onTeachersChange={fetchTeachers}
        />
        <StatsCards />
      </main>
    </div>
  );
}