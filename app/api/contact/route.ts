import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Contact form schema
const contactSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = contactSchema.parse(data);

    // Store the contact message in the database
    const contact = await prisma.message.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        status: 'UNREAD'
      }
    });

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({
        success: false,
        errors: error.errors,
      }), { status: 400 });
    }

    console.error("Contact form error:", error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Failed to send message",
    }), { status: 500 });
  }
}

// Add GET endpoint for superadmin to fetch contacts
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contacts = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Add PATCH endpoint to update contact status
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const { id, status } = data;

    const contact = await prisma.message.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Add DELETE endpoint to remove a contact message
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse("Contact ID is required", { status: 400 });
    }

    await prisma.message.delete({
      where: { id }
    });

    return new NextResponse("Contact deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
