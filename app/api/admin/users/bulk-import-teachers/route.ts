import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import * as ExcelJS from 'exceljs';

// Helper to validate email format
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const schoolId = formData.get('schoolId') as string;

    if (!file || !schoolId) {
      return new NextResponse('File and school ID are required', { status: 400 });
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return new NextResponse('File size must be less than 5MB', { status: 400 });
    }

    // Read the file
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1); // Get first worksheet

    if (!worksheet) {
      return new NextResponse('No worksheet found in the file', { status: 400 });
    }

    // Convert worksheet to array of objects
    const data: Array<{ Name: string; Email: string; Subjects?: string }> = [];
    const headers: string[] = [];

    // Get headers from the first row
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value?.toString() || '';
    });

    // Get data from remaining rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        rowData[header] = cell.value?.toString() || '';
      });
      data.push(rowData);
    });

    // Validate data length
    if (data.length === 0) {
      return new NextResponse('File contains no data', { status: 400 });
    }
    if (data.length > 100) {
      return new NextResponse('Maximum 100 teachers per import', { status: 400 });
    }

    // Validate headers
    const requiredHeaders = ['Name', 'Email'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return new NextResponse(
        `Missing required columns: ${missingHeaders.join(', ')}`,
        { status: 400 }
      );
    }

    // Validate and prepare data
    const errors: string[] = [];
    const teachers = [];
    const existingEmails = new Set();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Add 2 to account for 1-based indexing and header row

      // Check required fields
      if (!row.Name?.trim()) {
        errors.push(`Row ${rowNum}: Name is required`);
        continue;
      }
      if (!row.Email?.trim()) {
        errors.push(`Row ${rowNum}: Email is required`);
        continue;
      }

      // Validate email format
      if (!isValidEmail(row.Email)) {
        errors.push(`Row ${rowNum}: Invalid email format`);
        continue;
      }

      // Check for duplicate emails in the file
      if (existingEmails.has(row.Email.toLowerCase())) {
        errors.push(`Row ${rowNum}: Duplicate email in file`);
        continue;
      }
      existingEmails.add(row.Email.toLowerCase());

      // Add to teachers array
      teachers.push({
        name: row.Name.trim(),
        email: row.Email.trim().toLowerCase(),
        password: row.Email.trim().toLowerCase(), // Use email as password
        subjects: row.Subjects || null,
      });
    }

    // Check for validation errors
    if (errors.length > 0) {
      return new NextResponse(JSON.stringify({ errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for existing emails in database
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: teachers.map(t => t.email),
        },
      },
      select: { email: true },
    });

    if (existingUsers.length > 0) {
      return new NextResponse(
        JSON.stringify({
          errors: existingUsers.map((u: { email: string }) => `Email already exists: ${u.email}`),
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create teachers
    const createdTeachers = await prisma.$transaction(
      teachers.map(teacher =>
        prisma.user.create({
          data: {
            ...teacher,
            role: 'TEACHER',
            schoolId: schoolId,
          },
        })
      )
    );

    return new NextResponse(
      JSON.stringify({
        message: `Successfully created ${createdTeachers.length} teachers`,
        teachers: createdTeachers,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error importing teachers:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to import teachers',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
