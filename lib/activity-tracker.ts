export async function trackActivity(action: string) {
  try {
    await fetch('/api/activity/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
}
