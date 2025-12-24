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
import { Plus, Trash2, RefreshCw } from "lucide-react";

interface Department {
  DepartmentID: number;
  DName: string;
  Location: string;
}

interface DepartmentsTabProps {
  onDepartmentsChange: () => void;
}

export function DepartmentsTab({ onDepartmentsChange }: DepartmentsTabProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    DepartmentID: "",
    DName: "",
    Location: "",
  });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          DepartmentID: parseInt(formData.DepartmentID),
        }),
      });
      setDialogOpen(false);
      setFormData({ DepartmentID: "", DName: "", Location: "" });
      fetchDepartments();
      onDepartmentsChange();
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await fetch(`/api/departments?id=${id}`, { method: "DELETE" });
      fetchDepartments();
      onDepartmentsChange();
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchDepartments}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="deptid">Department ID</Label>
                  <Input
                    id="deptid"
                    type="number"
                    value={formData.DepartmentID}
                    onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dname">Name</Label>
                  <Input
                    id="dname"
                    value={formData.DName}
                    onChange={(e) => setFormData({ ...formData, DName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.Location}
                    onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Add Department</Button>
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
                <TableHead>Location</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.DepartmentID}>
                    <TableCell className="font-mono">{dept.DepartmentID}</TableCell>
                    <TableCell className="font-semibold">{dept.DName}</TableCell>
                    <TableCell>{dept.Location || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(dept.DepartmentID)}
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
