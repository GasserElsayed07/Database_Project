import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT e.*, s.SName as StudentName, c.CName as CourseName 
      FROM Enrolled e 
      LEFT JOIN Student s ON e.StudentSSN = s.StudentSSN
      LEFT JOIN Course c ON e.CourseID = c.Course_ID
    `);
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { StudentSSN, CourseID, EnrollmentDate, Grade } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Enrolled (StudentSSN, CourseID, EnrollmentDate, Grade)
       VALUES (?, ?, ?, ?)`,
      [StudentSSN, CourseID, EnrollmentDate, Grade || null]
    );
    await conn.end();

    return NextResponse.json({ message: "Enrollment added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add enrollment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { StudentSSN, CourseID, EnrollmentDate, Grade } = body;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE Enrolled SET EnrollmentDate = ?, Grade = ? WHERE StudentSSN = ? AND CourseID = ?`,
      [EnrollmentDate, Grade, StudentSSN, CourseID]
    );
    await conn.end();

    return NextResponse.json({ message: "Enrollment updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentSSN = searchParams.get("studentSSN");
    const courseID = searchParams.get("courseID");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Enrolled WHERE StudentSSN = ? AND CourseID = ?", [studentSSN, courseID]);
    await conn.end();

    return NextResponse.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 });
  }
}
