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
import { Plus, Trash2, RefreshCw } from "lucide-react";

interface Teacher {
  TeacherSSN: string;
  TName: string;
  Qualifications: string;
  Phone: string;
  Email: string;
  Hire_date: string;
  DepartmentID: number;
}

interface Department {
  DepartmentID: number;
  DName: string;
}

interface TeachersTabProps {
  departments: Department[];
  onTeachersChange: () => void;
}

export function TeachersTab({ departments, onTeachersChange }: TeachersTabProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    TeacherSSN: "",
    TName: "",
    Qualifications: "",
    Phone: "",
    Email: "",
    Hire_date: "",
    DepartmentID: "",
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          DepartmentID: parseInt(formData.DepartmentID),
        }),
      });
      setDialogOpen(false);
      setFormData({
        TeacherSSN: "",
        TName: "",
        Qualifications: "",
        Phone: "",
        Email: "",
        Hire_date: "",
        DepartmentID: "",
      });
      fetchTeachers();
      onTeachersChange();
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };

  const handleDelete = async (ssn: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await fetch(`/api/teachers?ssn=${ssn}`, { method: "DELETE" });
      fetchTeachers();
      onTeachersChange();
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  const getDepartmentName = (id: number) => {
    return departments.find((d) => d.DepartmentID === id)?.DName || "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teachers</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchTeachers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tssn">Teacher SSN</Label>
                    <Input
                      id="tssn"
                      value={formData.TeacherSSN}
                      onChange={(e) => setFormData({ ...formData, TeacherSSN: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tname">Name</Label>
                    <Input
                      id="tname"
                      value={formData.TName}
                      onChange={(e) => setFormData({ ...formData, TName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="quals">Qualifications</Label>
                  <Input
                    id="quals"
                    value={formData.Qualifications}
                    onChange={(e) => setFormData({ ...formData, Qualifications: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.Phone}
                      onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.Email}
                      onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hire">Hire Date</Label>
                    <Input
                      id="hire"
                      type="date"
                      value={formData.Hire_date}
                      onChange={(e) => setFormData({ ...formData, Hire_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dept">Department</Label>
                    <Select
                      value={formData.DepartmentID}
                      onValueChange={(value) => setFormData({ ...formData, DepartmentID: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                </div>
                <Button type="submit" className="w-full">Add Teacher</Button>
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
                <TableHead>Qualifications</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No teachers found
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.TeacherSSN}>
                    <TableCell className="font-mono">{teacher.TeacherSSN}</TableCell>
                    <TableCell>{teacher.TName}</TableCell>
                    <TableCell>{teacher.Qualifications || "-"}</TableCell>
                    <TableCell>{teacher.Email || "-"}</TableCell>
                    <TableCell>{teacher.Phone || "-"}</TableCell>
                    <TableCell>{getDepartmentName(teacher.DepartmentID)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(teacher.TeacherSSN)}
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
