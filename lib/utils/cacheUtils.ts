import { OnboardingData } from '@/lib/types/onboarding';

export function generateCacheKey(data: OnboardingData): string {
  const fromLocation = `${data.destination.from.city},${data.destination.from.state},${data.destination.from.country}`;
  const toLocation = `${data.destination.to.city},${data.destination.to.state},${data.destination.to.country}`;

  const keyData = {
    from: fromLocation.toLowerCase().trim(),
    to: toLocation.toLowerCase().trim(),
    startDate: data.dates.startDate,
    endDate: data.dates.endDate,
    adults: data.travelers.adults,
    children: data.travelers.children,
    travelStyle: data.travelers.travelStyle,
    interests: data.preferences.interests.sort().join(','),
    pace: data.preferences.pace,
    accommodation: data.preferences.accommodation,
    budget: data.budget.amount,
    currency: data.budget.currency,
  };

  const jsonString = JSON.stringify(keyData);
  return `atlas_cache_${simpleHash(jsonString)}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function getCachedItinerary(cacheKey: string) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const cacheDate = new Date(parsed.cachedAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 30) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return parsed.data;
    }
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

export function saveCachedItinerary(cacheKey: string, data: any) {
  try {
    const cacheData = {
      data,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('💾 Itinerary cached successfully');
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

export function clearAllCaches() {
  const keys = Object.keys(localStorage);
  let clearedCount = 0;

  keys.forEach(key => {
    if (key.startsWith('atlas_cache_') || key.startsWith('planify_cache_')) {
      localStorage.removeItem(key);
      clearedCount++;
    }
  });

  console.log(`🗑️ Cleared ${clearedCount} cached itineraries`);
  return clearedCount;
}
