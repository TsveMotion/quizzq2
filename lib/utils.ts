import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePassword(): string {
  // Generate a random password with the user's email
  return crypto.randomUUID().slice(0, 8);
}
