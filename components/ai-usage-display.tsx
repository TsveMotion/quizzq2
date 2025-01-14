import { Progress } from "@/components/ui/progress";
import { useAIUsage } from "@/hooks/use-ai-usage";
import { useEffect } from "react";

interface AIUsageDisplayProps {
  plan: 'free' | 'pro' | 'forever';
}

export function AIUsageDisplay({ plan }: AIUsageDisplayProps) {
  const { dailyUsage, monthlyUsage, lifetimeUsage, resetDailyUsage, resetMonthlyUsage } = useAIUsage();

  const limits = {
    free: { daily: 10, label: 'Daily Usage' },
    pro: { monthly: 1000, label: 'Monthly Usage' },
    forever: { lifetime: 10000, label: 'Lifetime Usage' }
  };

  const currentLimit = limits[plan];
  const usage = plan === 'free' ? dailyUsage : 
                plan === 'pro' ? monthlyUsage : 
                lifetimeUsage;
  const max = plan === 'free' ? currentLimit.daily : 
              plan === 'pro' ? currentLimit.monthly : 
              currentLimit.lifetime;

  useEffect(() => {
    // Check if we need to reset daily usage
    const now = new Date();
    const lastReset = new Date(useAIUsage.getState().lastResetDate);
    if (now.getDate() !== lastReset.getDate()) {
      resetDailyUsage();
    }

    // Check if we need to reset monthly usage
    if (now.getMonth() !== lastReset.getMonth()) {
      resetMonthlyUsage();
    }
  }, [resetDailyUsage, resetMonthlyUsage]);

  const percentage = (usage / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{currentLimit.label}</span>
        <span className="text-white font-medium">
          {usage} / {max} {plan === 'forever' ? 'Lifetime' : plan === 'pro' ? 'Monthly' : 'Daily'}
        </span>
      </div>
      <Progress value={percentage} className="h-2" 
        indicatorClassName={percentage >= 90 ? 'bg-red-500' : 
                           percentage >= 70 ? 'bg-yellow-500' : 
                           'bg-green-500'} />
    </div>
  );
}
