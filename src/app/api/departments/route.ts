import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute("SELECT * FROM Department");
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { DepartmentID, DName, Location } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Department (DepartmentID, DName, Location) VALUES (?, ?, ?)`,
      [DepartmentID, DName, Location]
    );
    await conn.end();

    return NextResponse.json({ message: "Department added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add department" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { DepartmentID, DName, Location } = body;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE Department SET DName = ?, Location = ? WHERE DepartmentID = ?`,
      [DName, Location, DepartmentID]
    );
    await conn.end();

    return NextResponse.json({ message: "Department updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Department WHERE DepartmentID = ?", [id]);
    await conn.end();

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}
