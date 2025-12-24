"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  ClipboardList, 
  DollarSign,
  Library,
  Loader2
} from "lucide-react";

interface Stats {
  students: number;
  teachers: number;
  departments: number;
  courses: number;
  enrollments: number;
  payments: { count: number; total: number };
  books: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mt-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: "Students",
      value: stats.students,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Teachers",
      value: stats.teachers,
      icon: GraduationCap,
      color: "text-green-500",
    },
    {
      label: "Departments",
      value: stats.departments,
      icon: Building2,
      color: "text-purple-500",
    },
    {
      label: "Courses",
      value: stats.courses,
      icon: BookOpen,
      color: "text-orange-500",
    },
    {
      label: "Enrollments",
      value: stats.enrollments,
      icon: ClipboardList,
      color: "text-cyan-500",
    },
    {
      label: "Payments",
      value: stats.payments.count,
      subValue: `$${Number(stats.payments.total).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      label: "Books",
      value: stats.books,
      icon: Library,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="flex flex-col items-center text-center gap-2">
            <item.icon className={`h-6 w-6 ${item.color}`} />
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            {item.subValue && (
              <p className="text-xs font-medium text-emerald-600">{item.subValue}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
