import { auth } from "@/lib/auth-config";

const handler = auth;
export { handler as GET, handler as POST };