import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export function CustomPrismaAdapter(prisma: PrismaClient) {
  const adapter = PrismaAdapter(prisma);
  
  return {
    ...adapter,
    createUser: (data: any) => {
      // Map emailVerified to email_verified
      const { emailVerified, ...rest } = data;
      return prisma.user.create({
        data: {
          ...rest,
          email_verified: emailVerified,
        },
      });
    },
    updateUser: async (data: any) => {
      // Map emailVerified to email_verified if present
      const { emailVerified, ...rest } = data;
      const updateData = {
        ...rest,
        ...(emailVerified !== undefined && { email_verified: emailVerified }),
      };
      
      const user = await prisma.user.update({
        where: { id: updateData.id },
        data: updateData,
      });

      return user;
    },
    getUser: adapter.getUser,
    getUserByEmail: adapter.getUserByEmail,
    getUserByAccount: adapter.getUserByAccount,
    deleteUser: adapter.deleteUser,
    linkAccount: adapter.linkAccount,
    unlinkAccount: adapter.unlinkAccount,
    createSession: adapter.createSession,
    getSessionAndUser: adapter.getSessionAndUser,
    updateSession: adapter.updateSession,
    deleteSession: adapter.deleteSession,
    createVerificationToken: adapter.createVerificationToken,
    useVerificationToken: adapter.useVerificationToken,
  };
}
