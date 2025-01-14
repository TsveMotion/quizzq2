import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIUsageStore {
  dailyUsage: number;
  monthlyUsage: number;
  lifetimeUsage: number;
  lastResetDate: string;
  incrementUsage: () => void;
  resetDailyUsage: () => void;
  resetMonthlyUsage: () => void;
}

export const useAIUsage = create<AIUsageStore>()(
  persist(
    (set) => ({
      dailyUsage: 0,
      monthlyUsage: 0,
      lifetimeUsage: 0,
      lastResetDate: new Date().toISOString(),
      incrementUsage: () =>
        set((state) => ({
          dailyUsage: state.dailyUsage + 1,
          monthlyUsage: state.monthlyUsage + 1,
          lifetimeUsage: state.lifetimeUsage + 1,
        })),
      resetDailyUsage: () =>
        set({
          dailyUsage: 0,
          lastResetDate: new Date().toISOString(),
        }),
      resetMonthlyUsage: () =>
        set({
          monthlyUsage: 0,
        }),
    }),
    {
      name: 'ai-usage',
    }
  )
);
