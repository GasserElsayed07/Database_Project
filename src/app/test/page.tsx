"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, Database, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TableResult {
  table: string;
  status: string;
  error?: string;
}

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TableResult[]>([]);
  const [executed, setExecuted] = useState(false);

  const createTables = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/setup", { method: "POST" });
      const data = await res.json();
      setResults(data.results || []);
      setExecuted(true);
    } catch (error) {
      console.error("Failed to create tables:", error);
      setResults([{ table: "All", status: "error", error: "Failed to connect to database" }]);
    }
    setLoading(false);
  };

  const tables = [
    { name: "Student", description: "Student information (SSN, Name, DOB, Gender)", note: "Already created" },
    { name: "Department", description: "Academic departments (ID, Name, Location)", note: "Will create" },
    { name: "Teacher", description: "Teacher info with department FK", note: "Will create" },
    { name: "Course", description: "Courses with department and teacher FK", note: "Will create" },
    { name: "Enrolled", description: "Student-Course M:N relationship", note: "Will create" },
    { name: "Payment", description: "Student payment records", note: "Will create" },
    { name: "Book", description: "Course books", note: "Will create" },
    { name: "Authors", description: "Book authors (multivalued)", note: "Will create" },
    { name: "Emails", description: "Student emails (multivalued)", note: "Will create" },
    { name: "Phones", description: "Student phones (multivalued)", note: "Will create" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Database className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Database Setup</h1>
                <p className="text-muted-foreground">Create tables for College Management System</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tables Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Database Schema
              </CardTitle>
              <CardDescription>
                Overview of all 10 tables in the college management database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables.map((table) => (
                      <TableRow key={table.name}>
                        <TableCell className="font-mono font-semibold">{table.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {table.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={table.name === "Student" ? "secondary" : "outline"}>
                            {table.note}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Create Tables Action */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Tables</CardTitle>
                <CardDescription>
                  Click the button below to create all tables (except Student which already exists).
                  Tables are created in the correct order to satisfy foreign key constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Creation Order:</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>Department (no dependencies)</li>
                    <li>Teacher (depends on Department)</li>
                    <li>Course (depends on Department, Teacher)</li>
                    <li>Enrolled (depends on Student, Course)</li>
                    <li>Payment (depends on Student)</li>
                    <li>Book (depends on Course)</li>
                    <li>Authors (depends on Book)</li>
                    <li>Emails (depends on Student)</li>
                    <li>Phones (depends on Student)</li>
                  </ol>
                </div>

                <Button 
                  onClick={createTables} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Tables...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Create All Tables
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {executed && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>
                    Status of each table creation attempt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.map((result, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          result.status === "success"
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-red-500/10 border border-red-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {result.status === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-mono font-semibold">{result.table}</span>
                        </div>
                        {result.error ? (
                          <span className="text-sm text-red-500 truncate max-w-[200px]">
                            {result.error}
                          </span>
                        ) : (
                          <Badge variant="secondary">Created</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="text-center text-sm text-muted-foreground">
                    {results.filter((r) => r.status === "success").length} of {results.length} tables
                    created successfully
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
