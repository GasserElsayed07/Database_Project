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

interface Enrollment {
  StudentSSN: string;
  CourseID: number;
  EnrollmentDate: string;
  Grade: string;
  StudentName?: string;
  CourseName?: string;
}

interface Student {
  StudentSSN: string;
  SName: string;
}

interface Course {
  Course_ID: number;
  CName: string;
}

export function EnrollmentsTab() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    StudentSSN: "",
    CourseID: "",
    EnrollmentDate: "",
    Grade: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollRes, studentsRes, coursesRes] = await Promise.all([
        fetch("/api/enrollments"),
        fetch("/api/students"),
        fetch("/api/courses"),
      ]);
      const [enrollData, studentsData, coursesData] = await Promise.all([
        enrollRes.json(),
        studentsRes.json(),
        coursesRes.json(),
      ]);
      setEnrollments(Array.isArray(enrollData) ? enrollData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          CourseID: parseInt(formData.CourseID),
        }),
      });
      setDialogOpen(false);
      setFormData({ StudentSSN: "", CourseID: "", EnrollmentDate: "", Grade: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to add enrollment:", error);
    }
  };

  const handleDelete = async (studentSSN: string, courseID: number) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return;
    try {
      await fetch(`/api/enrollments?studentSSN=${studentSSN}&courseID=${courseID}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
    }
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (!grade) return "outline";
    if (["A", "A+", "A-"].includes(grade)) return "default";
    if (["B", "B+", "B-"].includes(grade)) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enrollments</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Enrollment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll Student in Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="estudent">Student</Label>
                  <Select
                    value={formData.StudentSSN}
                    onValueChange={(value) => setFormData({ ...formData, StudentSSN: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.StudentSSN} value={s.StudentSSN}>
                          {s.SName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ecourse">Course</Label>
                  <Select
                    value={formData.CourseID}
                    onValueChange={(value) => setFormData({ ...formData, CourseID: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.Course_ID} value={c.Course_ID.toString()}>
                          {c.CName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edate">Enrollment Date</Label>
                  <Input
                    id="edate"
                    type="date"
                    value={formData.EnrollmentDate}
                    onChange={(e) => setFormData({ ...formData, EnrollmentDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="egrade">Grade (optional)</Label>
                  <Input
                    id="egrade"
                    value={formData.Grade}
                    onChange={(e) => setFormData({ ...formData, Grade: e.target.value })}
                    placeholder="e.g., A, B+, C"
                  />
                </div>
                <Button type="submit" className="w-full">Enroll Student</Button>
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
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No enrollments found
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((enrollment) => (
                  <TableRow key={`${enrollment.StudentSSN}-${enrollment.CourseID}`}>
                    <TableCell>{enrollment.StudentName || enrollment.StudentSSN}</TableCell>
                    <TableCell>{enrollment.CourseName || enrollment.CourseID}</TableCell>
                    <TableCell>
                      {enrollment.EnrollmentDate
                        ? new Date(enrollment.EnrollmentDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getGradeBadgeVariant(enrollment.Grade)}>
                        {enrollment.Grade || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(enrollment.StudentSSN, enrollment.CourseID)}
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
