"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, RefreshCw } from "lucide-react";

interface Course {
  Course_ID: number;
  CName: string;
  Credit_hours: number;
  DepartmentID: number;
  TeacherSSN: string;
  DepartmentName?: string;
  TeacherName?: string;
}

interface Department {
  DepartmentID: number;
  DName: string;
}

interface Teacher {
  TeacherSSN: string;
  TName: string;
}

interface CoursesTabProps {
  departments: Department[];
  teachers: Teacher[];
}

export function CoursesTab({ departments, teachers }: CoursesTabProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    Course_ID: "",
    CName: "",
    Credit_hours: "",
    DepartmentID: "",
    TeacherSSN: "",
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          Course_ID: parseInt(formData.Course_ID),
          Credit_hours: parseInt(formData.Credit_hours),
          DepartmentID: parseInt(formData.DepartmentID),
        }),
      });
      setDialogOpen(false);
      setFormData({
        Course_ID: "",
        CName: "",
        Credit_hours: "",
        DepartmentID: "",
        TeacherSSN: "",
      });
      fetchCourses();
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchCourses}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cid">Course ID</Label>
                    <Input
                      id="cid"
                      type="number"
                      value={formData.Course_ID}
                      onChange={(e) => setFormData({ ...formData, Course_ID: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credit Hours</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={formData.Credit_hours}
                      onChange={(e) => setFormData({ ...formData, Credit_hours: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cname">Course Name</Label>
                  <Input
                    id="cname"
                    value={formData.CName}
                    onChange={(e) => setFormData({ ...formData, CName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cdept">Department</Label>
                  <Select
                    value={formData.DepartmentID}
                    onValueChange={(value) => setFormData({ ...formData, DepartmentID: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.DepartmentID} value={d.DepartmentID.toString()}>
                          {d.DName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cteacher">Teacher</Label>
                  <Select
                    value={formData.TeacherSSN}
                    onValueChange={(value) => setFormData({ ...formData, TeacherSSN: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((t) => (
                        <SelectItem key={t.TeacherSSN} value={t.TeacherSSN}>
                          {t.TName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Course</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.Course_ID}>
                    <TableCell className="font-mono">{course.Course_ID}</TableCell>
                    <TableCell className="font-semibold">{course.CName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.Credit_hours} hrs</Badge>
                    </TableCell>
                    <TableCell>{course.DepartmentName || "-"}</TableCell>
                    <TableCell>{course.TeacherName || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(course.Course_ID)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
