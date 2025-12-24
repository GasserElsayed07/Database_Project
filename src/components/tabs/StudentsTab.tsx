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

interface Student {
  StudentSSN: string;
  SName: string;
  BOD: string;
  Gender: string;
  TeacherSSN: string;
}

interface Teacher {
  TeacherSSN: string;
  TName: string;
}

interface StudentsTabProps {
  teachers: Teacher[];
}

export function StudentsTab({ teachers }: StudentsTabProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    StudentSSN: "",
    SName: "",
    BOD: "",
    Gender: "M",
    TeacherSSN: "",
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setDialogOpen(false);
      setFormData({ StudentSSN: "", SName: "", BOD: "", Gender: "M", TeacherSSN: "" });
      fetchStudents();
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleDelete = async (ssn: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch(`/api/students?ssn=${ssn}`, { method: "DELETE" });
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchStudents}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="ssn">Student SSN</Label>
                  <Input
                    id="ssn"
                    value={formData.StudentSSN}
                    onChange={(e) => setFormData({ ...formData, StudentSSN: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.SName}
                    onChange={(e) => setFormData({ ...formData, SName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bod">Date of Birth</Label>
                  <Input
                    id="bod"
                    type="date"
                    value={formData.BOD}
                    onChange={(e) => setFormData({ ...formData, BOD: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.Gender}
                    onValueChange={(value) => setFormData({ ...formData, Gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="advisor">Advisor (Teacher)</Label>
                  <Select
                    value={formData.TeacherSSN}
                    onValueChange={(value) => setFormData({ ...formData, TeacherSSN: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select advisor" />
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
                <Button type="submit" className="w-full">Add Student</Button>
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
                <TableHead>SSN</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Advisor SSN</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.StudentSSN}>
                    <TableCell className="font-mono">{student.StudentSSN}</TableCell>
                    <TableCell>{student.SName}</TableCell>
                    <TableCell>{student.BOD ? new Date(student.BOD).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={student.Gender === "M" ? "default" : "secondary"}>
                        {student.Gender === "M" ? "Male" : "Female"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{student.TeacherSSN || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student.StudentSSN)}
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
