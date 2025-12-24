import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT b.*, c.CName as CourseName 
      FROM Book b 
      LEFT JOIN Course c ON b.CourseID = c.Course_ID
    `);
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { BookID, Title, PublishYear, CourseID } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Book (BookID, Title, PublishYear, CourseID)
       VALUES (?, ?, ?, ?)`,
      [BookID, Title, PublishYear, CourseID]
    );
    await conn.end();

    return NextResponse.json({ message: "Book added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Book WHERE BookID = ?", [id]);
    await conn.end();

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
