import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import * as ExcelJS from 'exceljs';
import { generatePassword } from '@/lib/utils';

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

    // Get headers and data
    const data: Array<{ [key: string]: string }> = [];
    const headers: string[] = [];

    // Get headers from the first row
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber - 1] = (cell.value?.toString() || '').toLowerCase();
    });

    // Get data from remaining rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowData: { [key: string]: string } = {};
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
    if (data.length > 500) {
      return new NextResponse('Maximum 500 students per import', { status: 400 });
    }

    // Validate required headers
    const requiredHeaders = ['email', 'name'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return new NextResponse(
        `Missing required columns: ${missingHeaders.join(', ')}`,
        { status: 400 }
      );
    }

    // Validate and prepare data
    const errors: string[] = [];
    const students: { email: string; name: string; password: string; className?: string }[] = [];
    const existingEmails = new Set();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Add 2 to account for 1-based indexing and header row

      // Get values (headers are already lowercase from earlier)
      const name = row['name']?.trim();
      const email = row['email']?.trim();
      const className = row['class']?.trim();

      // Check required fields
      if (!name) {
        errors.push(`Row ${rowNum}: Name is required`);
        continue;
      }
      if (!email) {
        errors.push(`Row ${rowNum}: Email is required`);
        continue;
      }

      // Validate email format
      if (!isValidEmail(email)) {
        errors.push(`Row ${rowNum}: Invalid email format`);
        continue;
      }

      // Check for duplicate emails in the file
      if (existingEmails.has(email.toLowerCase())) {
        errors.push(`Row ${rowNum}: Duplicate email in file`);
        continue;
      }
      existingEmails.add(email.toLowerCase());

      // Add to students array
      students.push({
        name,
        email: email.toLowerCase(),
        password: generatePassword(),
        className,
      });
    }

    // Check for existing emails in database
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: students.map(s => s.email),
        },
      },
      select: { email: true },
    });

    if (existingUsers.length > 0) {
      const existingEmails = existingUsers.map((u: { email: string }) => u.email);
      errors.push(`The following emails already exist: ${existingEmails.join(', ')}`);
    }

    // If there are any errors, return them
    if (errors.length > 0) {
      return NextResponse.json(
        { message: errors.join('\n') },
        { status: 400 }
      );
    }

    // Create all students and assign them to classes if specified
    const createdStudents = await prisma.$transaction(async (tx) => {
      const created = [];

      // First, find or create a default teacher for new classes
      let defaultTeacher = await tx.user.findFirst({
        where: {
          schoolId: schoolId,
          role: 'TEACHER',
        },
      });

      if (!defaultTeacher) {
        defaultTeacher = await tx.user.create({
          data: {
            name: 'Default Teacher',
            email: `default.teacher.${schoolId}@quizzq.com`,
            password: generatePassword(),
            role: 'TEACHER',
            schoolId: schoolId,
          },
        });
      }

      // Process each student
      for (const student of students) {
        try {
          const { className, ...userData } = student;
          
          // Create the student
          const createdStudent = await tx.user.create({
            data: {
              ...userData,
              role: 'STUDENT',
              school: {
                connect: { id: schoolId },
              },
            },
          });

          // If class name is provided, find or create the class and connect the student
          if (className) {
            let existingClass = await tx.class.findFirst({
              where: {
                name: className,
                schoolId: schoolId,
              },
            });

            if (existingClass) {
              // Add student to existing class
              await tx.class.update({
                where: { id: existingClass.id },
                data: {
                  students: {
                    connect: { id: createdStudent.id },
                  },
                },
              });
            } else {
              // Create new class with the default teacher
              existingClass = await tx.class.create({
                data: {
                  name: className,
                  school: {
                    connect: { id: schoolId },
                  },
                  teacher: {
                    connect: { id: defaultTeacher.id },
                  },
                  students: {
                    connect: { id: createdStudent.id },
                  },
                },
              });
            }
          }

          created.push({ ...createdStudent, status: 'success' });
        } catch (error) {
          created.push({
            ...student,
            status: 'error',
            error: (error as Error).message,
          });
        }
      }
      return created;
    });

    return NextResponse.json({
      message: 'Students imported successfully',
      count: createdStudents.filter(s => s.status === 'success').length,
    });
  } catch (error) {
    console.error('[BULK_IMPORT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
