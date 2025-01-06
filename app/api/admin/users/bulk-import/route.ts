import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
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
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as Array<{
      [key: string]: string;
    }>;

    // Validate data length
    if (data.length === 0) {
      return new NextResponse('File contains no data', { status: 400 });
    }
    if (data.length > 500) {
      return new NextResponse('Maximum 500 students per import', { status: 400 });
    }

    // Get headers in a case-insensitive way
    const headers = Object.keys(data[0]).map(h => h.toLowerCase());
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
    const students = [];
    const existingEmails = new Set();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Add 2 to account for 1-based indexing and header row

      // Get values in a case-insensitive way
      const name = Object.entries(row).find(([key]) => key.toLowerCase() === 'name')?.[1]?.trim();
      const email = Object.entries(row).find(([key]) => key.toLowerCase() === 'email')?.[1]?.trim();
      const className = Object.entries(row).find(([key]) => key.toLowerCase() === 'class')?.[1]?.trim();

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
      const existingEmails = existingUsers.map(u => u.email);
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

        created.push(createdStudent);
      }
      return created;
    });

    return NextResponse.json({
      message: 'Students imported successfully',
      count: createdStudents.length,
    });
  } catch (error) {
    console.error('[BULK_IMPORT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
