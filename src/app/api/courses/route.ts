import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT c.*, d.DName as DepartmentName, t.TName as TeacherName 
      FROM Course c 
      LEFT JOIN Department d ON c.DepartmentID = d.DepartmentID
      LEFT JOIN Teacher t ON c.TeacherSSN = t.TeacherSSN
    `);
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { Course_ID, CName, Credit_hours, DepartmentID, TeacherSSN } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Course (Course_ID, CName, Credit_hours, DepartmentID, TeacherSSN)
       VALUES (?, ?, ?, ?, ?)`,
      [Course_ID, CName, Credit_hours, DepartmentID, TeacherSSN]
    );
    await conn.end();

    return NextResponse.json({ message: "Course added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add course" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { Course_ID, CName, Credit_hours, DepartmentID, TeacherSSN } = body;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE Course SET CName = ?, Credit_hours = ?, DepartmentID = ?, TeacherSSN = ? WHERE Course_ID = ?`,
      [CName, Credit_hours, DepartmentID, TeacherSSN, Course_ID]
    );
    await conn.end();

    return NextResponse.json({ message: "Course updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Course WHERE Course_ID = ?", [id]);
    await conn.end();

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
