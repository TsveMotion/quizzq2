import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// Get superadmin credentials from environment variables
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'superadmin@quizzq.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'admin123';

async function main() {
    // Create initial school
    const school = await prisma.school.create({
        data: {
            name: "QuizzQ Academy",
            roleNumber: "QA001",
            description: "Main QuizzQ School"
        }
    });

    // Create superadmin
    const hashedPassword = await hash(SUPERADMIN_PASSWORD, 10);
    const superadmin = await prisma.user.create({
        data: {
            email: SUPERADMIN_EMAIL,
            password: hashedPassword,
            name: "Super Admin",
            role: "superadmin",
            powerLevel: 5
        }
    });

    // Create a teacher
    const teacherPassword = await hash("teacher123", 10);
    const teacher = await prisma.user.create({
        data: {
            email: "teacher@quizzq.com",
            password: teacherPassword,
            name: "Test Teacher",
            role: "teacher",
            powerLevel: 3,
            schoolId: school.id
        }
    });

    // Create a student
    const studentPassword = await hash("student123", 10);
    const student = await prisma.user.create({
        data: {
            email: "student@quizzq.com",
            password: studentPassword,
            name: "Test Student",
            role: "student",
            powerLevel: 1,
            schoolId: school.id,
            teacherId: teacher.id
        }
    });

    console.log({ school, superadmin, teacher, student });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
