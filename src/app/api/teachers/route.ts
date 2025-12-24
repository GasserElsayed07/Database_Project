import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM Teacher");
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { TeacherSSN, TName, Qualifications, Phone, Email, Hire_date, DepartmentID } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Teacher (TeacherSSN, TName, Qualifications, Phone, Email, Hire_date, DepartmentID)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [TeacherSSN, TName, Qualifications, Phone, Email, Hire_date, DepartmentID]
    );
    await conn.end();

    return NextResponse.json({ message: "Teacher added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add teacher" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { TeacherSSN, TName, Qualifications, Phone, Email, Hire_date, DepartmentID } = body;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE Teacher SET TName = ?, Qualifications = ?, Phone = ?, Email = ?, Hire_date = ?, DepartmentID = ? WHERE TeacherSSN = ?`,
      [TName, Qualifications, Phone, Email, Hire_date, DepartmentID, TeacherSSN]
    );
    await conn.end();

    return NextResponse.json({ message: "Teacher updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ssn = searchParams.get("ssn");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Teacher WHERE TeacherSSN = ?", [ssn]);
    await conn.end();

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
