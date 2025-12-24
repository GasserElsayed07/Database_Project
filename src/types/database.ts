// Database Types for College Management System

export interface Student {
  StudentSSN: string;
  SName: string;
  BOD: string;
  Gender: 'M' | 'F';
  TeacherSSN: string;
}

export interface Teacher {
  TeacherSSN: string;
  TName: string;
  Qualifications: string;
  Phone: string;
  Email: string;
  Hire_date: string;
  DepartmentID: number;
}

export interface Department {
  DepartmentID: number;
  DName: string;
  Location: string;
}

export interface Course {
  Course_ID: number;
  CName: string;
  Credit_hours: number;
  DepartmentID: number;
  TeacherSSN: string;
}

export interface Enrolled {
  StudentSSN: string;
  CourseID: number;
  EnrollmentDate: string;
  Grade: string;
}

export interface Payment {
  PaymentID: number;
  Date: string;
  Amount: number;
  StudentSSN: string;
}

export interface Book {
  BookID: number;
  Title: string;
  PublishYear: number;
  CourseID: number;
}

export interface Author {
  AuthorName: string;
  BookID: number;
}

export interface StudentEmail {
  Email: string;
  StudentSSN: string;
}

export interface StudentPhone {
  PhoneNum: string;
  StudentSSN: string;
}
