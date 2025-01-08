import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = (await request.json()) as Session;

    if (!session) {
      return NextResponse.json({ error: "No session provided" }, { status: 400 });
    }

    // Force a session update by updating the session token
    // This will trigger a new JWT to be created with updated user data
    const newToken = await authOptions.callbacks?.jwt?.({
      token: { ...(session.user as any), [Symbol.iterator]: undefined } as JWT,
      user: session.user,
      account: null,
      trigger: "update",
      session: { isPro: true }
    });

    const newSession = await authOptions.callbacks?.session?.({
      session,
      token: { ...(newToken as any), [Symbol.iterator]: undefined } as JWT,
      user: session.user,
      trigger: "update",
      newSession: { isPro: true }
    });

    return NextResponse.json({ session: newSession });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
