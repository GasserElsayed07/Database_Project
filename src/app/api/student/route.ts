"use server";
import { getConnection } from "@/utils/connection";

export async function POST(request) {
  const body = await request.json();
  const { StudentSSN, SName, BOD, Gender, TeacherSSN } = body;

  const conn = await getConnection();

  await conn.execute(
    `INSERT INTO Student (StudentSSN, SName, BOD, Gender, TeacherSSN)
     VALUES (?, ?, ?, ?, ?)`,
    [StudentSSN, SName, BOD, Gender, TeacherSSN]
  );

  await conn.end();

  return Response.json({ message: "Student added successfully" }, { status: 201 });
}
