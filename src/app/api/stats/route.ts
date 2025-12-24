import { getConnection } from "@/utils/connection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    
    const queries = [
      { key: "students", sql: "SELECT COUNT(*) as count FROM Student" },
      { key: "teachers", sql: "SELECT COUNT(*) as count FROM Teacher" },
      { key: "departments", sql: "SELECT COUNT(*) as count FROM Department" },
      { key: "courses", sql: "SELECT COUNT(*) as count FROM Course" },
      { key: "enrollments", sql: "SELECT COUNT(*) as count FROM Enrolled" },
      { key: "payments", sql: "SELECT COUNT(*) as count, COALESCE(SUM(Amount), 0) as total FROM Payment" },
      { key: "books", sql: "SELECT COUNT(*) as count FROM Book" },
    ];

    const stats: Record<string, any> = {};

    for (const query of queries) {
      try {
        const [rows] = await conn.execute(query.sql);
        const result = (rows as any[])[0];
        if (query.key === "payments") {
          stats[query.key] = { count: result.count, total: result.total };
        } else {
          stats[query.key] = result.count;
        }
      } catch {
        stats[query.key] = query.key === "payments" ? { count: 0, total: 0 } : 0;
      }
    }

    await conn.end();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ 
      students: 0, 
      teachers: 0, 
      departments: 0, 
      courses: 0, 
      enrollments: 0, 
      payments: { count: 0, total: 0 }, 
      books: 0 
    });
  }
}
