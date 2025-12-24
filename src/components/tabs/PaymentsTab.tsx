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
import { Plus, Trash2, RefreshCw, DollarSign } from "lucide-react";

interface Payment {
  PaymentID: number;
  Date: string;
  Amount: number;
  StudentSSN: string;
  StudentName?: string;
}

interface Student {
  StudentSSN: string;
  SName: string;
}

export function PaymentsTab() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    PaymentID: "",
    Date: "",
    Amount: "",
    StudentSSN: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, studentsRes] = await Promise.all([
        fetch("/api/payments"),
        fetch("/api/students"),
      ]);
      const [paymentsData, studentsData] = await Promise.all([
        paymentsRes.json(),
        studentsRes.json(),
      ]);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
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
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          PaymentID: parseInt(formData.PaymentID),
          Amount: parseFloat(formData.Amount),
        }),
      });
      setDialogOpen(false);
      setFormData({ PaymentID: "", Date: "", Amount: "", StudentSSN: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to add payment:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await fetch(`/api/payments?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const totalPayments = payments.reduce((sum, p) => sum + (parseFloat(String(p.Amount)) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground">
            Total: <span className="font-semibold text-foreground">${totalPayments.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pid">Payment ID</Label>
                  <Input
                    id="pid"
                    type="number"
                    value={formData.PaymentID}
                    onChange={(e) => setFormData({ ...formData, PaymentID: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pstudent">Student</Label>
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
                  <Label htmlFor="pdate">Payment Date</Label>
                  <Input
                    id="pdate"
                    type="date"
                    value={formData.Date}
                    onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pamount">Amount ($)</Label>
                  <Input
                    id="pamount"
                    type="number"
                    step="0.01"
                    value={formData.Amount}
                    onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Record Payment</Button>
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
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.PaymentID}>
                    <TableCell className="font-mono">{payment.PaymentID}</TableCell>
                    <TableCell>{payment.StudentName || payment.StudentSSN}</TableCell>
                    <TableCell>
                      {payment.Date ? new Date(payment.Date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {parseFloat(String(payment.Amount)).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(payment.PaymentID)}
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
