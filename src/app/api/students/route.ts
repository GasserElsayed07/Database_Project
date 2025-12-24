import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM Student");
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { StudentSSN, SName, BOD, Gender, TeacherSSN } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Student (StudentSSN, SName, BOD, Gender, TeacherSSN)
       VALUES (?, ?, ?, ?, ?)`,
      [StudentSSN, SName, BOD, Gender, TeacherSSN]
    );
    await conn.end();

    return NextResponse.json({ message: "Student added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { StudentSSN, SName, BOD, Gender, TeacherSSN } = body;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE Student SET SName = ?, BOD = ?, Gender = ?, TeacherSSN = ? WHERE StudentSSN = ?`,
      [SName, BOD, Gender, TeacherSSN, StudentSSN]
    );
    await conn.end();

    return NextResponse.json({ message: "Student updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ssn = searchParams.get("ssn");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Student WHERE StudentSSN = ?", [ssn]);
    await conn.end();

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
