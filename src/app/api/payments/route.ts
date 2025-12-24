import { getConnection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, s.SName as StudentName 
      FROM Payment p 
      LEFT JOIN Student s ON p.StudentSSN = s.StudentSSN
    `);
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { PaymentID, Date, Amount, StudentSSN } = body;

    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Payment (PaymentID, Date, Amount, StudentSSN)
       VALUES (?, ?, ?, ?)`,
      [PaymentID, Date, Amount, StudentSSN]
    );
    await conn.end();

    return NextResponse.json({ message: "Payment added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add payment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const conn = await getConnection();
    await conn.execute("DELETE FROM Payment WHERE PaymentID = ?", [id]);
    await conn.end();

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}
