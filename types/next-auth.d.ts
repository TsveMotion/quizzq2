import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: string
    schoolId: string | null
    emailVerified: Date | null
    image: string | null
    isPro: boolean
    proSubscriptionId: string | null
    proExpiresAt: Date | null
    proType: string | null
    powerLevel: number
    proStatus: string
    proPlan: string | null
    proPlanId: string | null
    proPlanName: string | null
    proPlanPrice: number | null
    proPlanCurrency: string | null
    proPlanInterval: string | null
    proPlanTrialPeriodDays: number | null
    proPlanIsActive: boolean
    proPlanIsTrial: boolean
    proPlanStartedAt: Date | null
    proPlanEndedAt: Date | null
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      isPro: boolean
      proSubscriptionId?: string
      proExpiresAt?: Date
      proType?: string
      schoolId?: string
      emailVerified?: Date
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    schoolId: string | null
    isPro: boolean
    proSubscriptionId: string | null
    proExpiresAt: Date | null
    proType: string | null
    powerLevel: number
    proStatus: string
    proPlan: string | null
    proPlanId: string | null
    proPlanName: string | null
    proPlanPrice: number | null
    proPlanCurrency: string | null
    proPlanInterval: string | null
    proPlanTrialPeriodDays: number | null
    proPlanIsActive: boolean
    proPlanIsTrial: boolean
    proPlanStartedAt: Date | null
    proPlanEndedAt: Date | null
  }
}
