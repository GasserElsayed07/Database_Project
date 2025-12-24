import { getConnection } from "@/utils/connection";
import { NextResponse } from "next/server";

export async function POST() {
  const conn = await getConnection();
  const results: { table: string; status: string; error?: string }[] = [];

  const createTableQueries = [
    {
      name: "Department",
      sql: `CREATE TABLE IF NOT EXISTS Department (
        DepartmentID INT PRIMARY KEY,
        DName VARCHAR(100) NOT NULL,
        Location VARCHAR(100)
      )`
    },
    {
      name: "Teacher",
      sql: `CREATE TABLE IF NOT EXISTS Teacher (
        TeacherSSN VARCHAR(20) PRIMARY KEY,
        TName VARCHAR(100) NOT NULL,
        Qualifications VARCHAR(200),
        Phone VARCHAR(20),
        Email VARCHAR(100),
        Hire_date DATE,
        DepartmentID INT,
        FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
      )`
    },
    {
      name: "Course",
      sql: `CREATE TABLE IF NOT EXISTS Course (
        Course_ID INT PRIMARY KEY,
        CName VARCHAR(100) NOT NULL,
        Credit_hours INT,
        DepartmentID INT,
        TeacherSSN VARCHAR(20),
        FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
        FOREIGN KEY (TeacherSSN) REFERENCES Teacher(TeacherSSN)
      )`
    },
    {
      name: "Enrolled",
      sql: `CREATE TABLE IF NOT EXISTS Enrolled (
        StudentSSN INT,
        CourseID INT,
        EnrollmentDate DATE,
        Grade VARCHAR(5),
        PRIMARY KEY (StudentSSN, CourseID),
        FOREIGN KEY (StudentSSN) REFERENCES Student(StudentSSN),
        FOREIGN KEY (CourseID) REFERENCES Course(Course_ID)
      )`
    },
    {
      name: "Payment",
      sql: `CREATE TABLE IF NOT EXISTS Payment (
        PaymentID INT PRIMARY KEY,
        Date DATE,
        Amount DECIMAL(10, 2),
        StudentSSN INT,
        FOREIGN KEY (StudentSSN) REFERENCES Student(StudentSSN)
      )`
    },
    {
      name: "Book",
      sql: `CREATE TABLE IF NOT EXISTS Book (
        BookID INT PRIMARY KEY,
        Title VARCHAR(200) NOT NULL,
        PublishYear INT,
        CourseID INT,
        FOREIGN KEY (CourseID) REFERENCES Course(Course_ID)
      )`
    },
    {
      name: "Authors",
      sql: `CREATE TABLE IF NOT EXISTS Authors (
        AuthorName VARCHAR(100),
        BookID INT,
        PRIMARY KEY (AuthorName, BookID),
        FOREIGN KEY (BookID) REFERENCES Book(BookID)
      )`
    },
    {
      name: "Emails",
      sql: `CREATE TABLE IF NOT EXISTS Emails (
        Email VARCHAR(100),
        StudentSSN INT,
        PRIMARY KEY (Email, StudentSSN),
        FOREIGN KEY (StudentSSN) REFERENCES Student(StudentSSN)
      )`
    },
    {
      name: "Phones",
      sql: `CREATE TABLE IF NOT EXISTS Phones (
        PhoneNum VARCHAR(20),
        StudentSSN INT,
        PRIMARY KEY (PhoneNum, StudentSSN),
        FOREIGN KEY (StudentSSN) REFERENCES Student(StudentSSN)
      )`
    }
  ];

  for (const query of createTableQueries) {
    try {
      await conn.execute(query.sql);
      results.push({ table: query.name, status: "success" });
    } catch (error: any) {
      results.push({ table: query.name, status: "error", error: error.message });
    }
  }

  await conn.end();

  return NextResponse.json({
    message: "Table creation completed",
    results
  });
}
