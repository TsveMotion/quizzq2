const PROMPT_USAGE_KEY = 'quizzq_prompt_usage';
const MAX_PROMPTS = 5;

export interface PromptUsage {
  count: number;
  lastReset: string;
}

export function getPromptUsage(): PromptUsage {
  if (typeof window === 'undefined') return { count: 0, lastReset: new Date().toISOString() };
  
  const stored = localStorage.getItem(PROMPT_USAGE_KEY);
  if (!stored) {
    const initial = { count: 0, lastReset: new Date().toISOString() };
    localStorage.setItem(PROMPT_USAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  
  return JSON.parse(stored);
}

export function incrementPromptUsage(): PromptUsage {
  const current = getPromptUsage();
  const updated = { ...current, count: current.count + 1 };
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROMPT_USAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function hasReachedPromptLimit(): boolean {
  const { count } = getPromptUsage();
  return count >= MAX_PROMPTS;
}

export function resetPromptUsage(): void {
  const reset = { count: 0, lastReset: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROMPT_USAGE_KEY, JSON.stringify(reset));
  }
}
