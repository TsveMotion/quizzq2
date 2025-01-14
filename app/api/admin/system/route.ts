import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

// GET /api/admin/system - Get system settings
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.SUPERADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      const newSettings = await prisma.systemSettings.create({
        data: {
          key: 'default',
          value: JSON.stringify({
            theme: 'light',
            notifications: true
          })
        }
      });
      return NextResponse.json(newSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[SYSTEM_SETTINGS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/system - Update system settings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.SUPERADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { maintenanceMode, maintenanceMessage } = body;

    // Update cookies
    const cookieStore = cookies();
    cookieStore.set('maintenance_mode', maintenanceMode.toString(), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    if (maintenanceMessage) {
      cookieStore.set('maintenance_message', encodeURIComponent(maintenanceMessage), {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    } else {
      cookieStore.delete('maintenance_message');
    }

    // Update database
    const settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      const newSettings = await prisma.systemSettings.create({
        data: {
          key: 'default',
          value: JSON.stringify({
            theme: 'light',
            notifications: true
          })
        }
      });
      return NextResponse.json(newSettings);
    } else {
      const updatedSettings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          value: JSON.stringify({
            theme: 'light',
            notifications: true,
            maintenanceMode,
            maintenanceMessage
          })
        }
      });
      return NextResponse.json(updatedSettings);
    }
  } catch (error) {
    console.error('[SYSTEM_SETTINGS_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
