import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

console.log('Auth route handler initialized with options:', {
  providers: authOptions.providers.map(p => p.name),
  callbacks: Object.keys(authOptions.callbacks || {}),
  pages: authOptions.pages
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };