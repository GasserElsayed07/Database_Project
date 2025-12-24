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
import { Plus, Trash2, RefreshCw, BookOpen } from "lucide-react";

interface Book {
  BookID: number;
  Title: string;
  PublishYear: number;
  CourseID: number;
  CourseName?: string;
}

interface Course {
  Course_ID: number;
  CName: string;
}

export function BooksTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    BookID: "",
    Title: "",
    PublishYear: "",
    CourseID: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, coursesRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/courses"),
      ]);
      const [booksData, coursesData] = await Promise.all([
        booksRes.json(),
        coursesRes.json(),
      ]);
      setBooks(Array.isArray(booksData) ? booksData : []);
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
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          BookID: parseInt(formData.BookID),
          PublishYear: parseInt(formData.PublishYear),
          CourseID: parseInt(formData.CourseID),
        }),
      });
      setDialogOpen(false);
      setFormData({ BookID: "", Title: "", PublishYear: "", CourseID: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await fetch(`/api/books?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Books</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="bid">Book ID</Label>
                  <Input
                    id="bid"
                    type="number"
                    value={formData.BookID}
                    onChange={(e) => setFormData({ ...formData, BookID: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="btitle">Title</Label>
                  <Input
                    id="btitle"
                    value={formData.Title}
                    onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="byear">Publish Year</Label>
                  <Input
                    id="byear"
                    type="number"
                    value={formData.PublishYear}
                    onChange={(e) => setFormData({ ...formData, PublishYear: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bcourse">Course</Label>
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
                <Button type="submit" className="w-full">Add Book</Button>
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
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No books found
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.BookID}>
                    <TableCell className="font-mono">{book.BookID}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {book.Title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.PublishYear}</Badge>
                    </TableCell>
                    <TableCell>{book.CourseName || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.BookID)}
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
