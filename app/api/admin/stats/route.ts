import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const ADMIN_ROLES = ["ADMIN", "SUPERADMIN", "admin", "superadmin"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has admin privileges
    if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role.toUpperCase())) {
      console.log("Unauthorized access attempt:", session?.user);
      return new NextResponse("Unauthorized - Admin access required", { status: 401 });
    }

    console.log("Authorized access by:", session.user);

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get pro users
    const proUsers = await prisma.user.count({
      where: {
        subscriptionStatus: "active",
        subscriptionPlan: {
          in: ["pro", "forever"]
        }
      }
    });

    // Get total schools
    const totalSchools = await prisma.school.count();

    // Calculate month-over-month growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const newUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });

    const newProUsersLastMonth = await prisma.user.count({
      where: {
        subscriptionStatus: "active",
        subscriptionPlan: {
          in: ["pro", "forever"]
        },
        createdAt: {
          gte: lastMonth
        }
      }
    });

    const newSchoolsLastMonth = await prisma.school.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionPlan: true
      }
    });

    // Get revenue data (mock data for now)
    const revenueData = [2500, 2850, 2300, 3800, 3200, 1900];

    return NextResponse.json({
      totalUsers,
      totalSubscriptions: proUsers,
      activeSchools: totalSchools,
      systemHealth: "99.9%",
      revenueData,
      newUsers: recentUsers.map(user => ({
        name: user.name || 'Anonymous',
        email: user.email || '',
        date: user.createdAt.toLocaleDateString()
      }))
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
