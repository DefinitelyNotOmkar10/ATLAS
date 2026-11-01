import { OnboardingData, LocationDetail } from '@/lib/types/onboarding';

function getLocationString(location: LocationDetail): string {
  const parts = [location.city, location.state, location.country].filter((part) => part.trim());
  return parts.join(", ");
}

export function buildItineraryPrompt(data: OnboardingData): string {
  const duration = calculateDuration(data.dates.startDate, data.dates.endDate);
  const fromLocation = getLocationString(data.destination.from);
  const toLocation = getLocationString(data.destination.to);
  const transportMode = data.destination.transport || 'other';
  const hotelBudgetPerDay = calculateHotelBudgetPerDay(data.budget.amount, duration);

  return `You are an elite travel intelligence architect.
Synthesize 3 DISTINCT, HIGHLY CURATED itinerary concepts for a ${duration}-day expedition from ${fromLocation} to ${toLocation}.

TRAVELER PROFILE:
- Name: ${data.name}
- Group: ${data.travelers.adults} adult(s), ${data.travelers.children} children
- Travel Style: ${data.travelers.travelStyle}
- Total Budget: ${data.budget.currency} ${data.budget.amount}
- Travel Dates: ${formatDate(data.dates.startDate)} to ${formatDate(data.dates.endDate)}
- Interests: ${data.preferences.interests.join(', ')}
- Preferred Pace: ${data.preferences.pace}
- Accommodation Tier: ${data.preferences.accommodation}
- Max Hotel Price Per Night: ${data.budget.currency} ${hotelBudgetPerDay}

THE 3 DISTINCT CONCEPTS TO GENERATE:
1. Concept 1 (id: "iconic")
   - Title: "The Iconic Highlights Expedition"
   - Tagline: "Signature landmarks, quintessential sights, and celebrated cultural heritage."
   - Theme: "Classic & Must-See Heritage"
   - Badge: "Most Popular"
   - Focus: Renowned monuments, panoramic viewpoints, iconic dining, famous cultural treasures.

2. Concept 2 (id: "hidden_gems")
   - Title: "Secret Spots & Artisan Trail"
   - Tagline: "Secluded alleyways, local neighborhood markets, and bohemian culinary gems."
   - Theme: "Off-The-Beaten-Path Discovery"
   - Badge: "Explorer Choice"
   - Focus: Lesser-known secret spots, artisan workshops, authentic local cafes, scenic hideaways.

3. Concept 3 (id: "luxury_leisure")
   - Title: "Scenic Leisure & Indulgence"
   - Tagline: "Rooftop golden hours, scenic coastal/mountain vistas, and unhurried boutique dining."
   - Theme: "VIP Leisure & Fine Living"
   - Badge: "Luxury Tier"
   - Focus: Relaxed mornings, breathtaking scenery, fine gastronomy, wellness & prime leisure.

FOR EACH CONCEPT, PROVIDE:
- id: "iconic" | "hidden_gems" | "luxury_leisure"
- title: String
- tagline: String
- theme: String
- badge: String
- highlights: Array of 3-4 landmark/experience names
- estimated_daily_pace: String (e.g. "Balanced (3-4 sights/day)", "Immersive & Experiential", "Unhurried & Relaxed")
${transportMode === 'car' ? '- journey_stops: Array of 3 scenic waypoint stops along the driving route' : ''}
- days: Full array of ${duration} day objects. For every day, include:
    * day: 1..${duration}
    * date: "YYYY-MM-DD"
    * morning: { name, description, duration, estimated_cost }
    * afternoon: { name, description, duration, estimated_cost }
    * evening: { name, description, duration, estimated_cost }
    * meals: Array of 3 meals (Breakfast, Lunch, Dinner) with name, cuisine, price_range, location
    * hotels: Array of 3-4 recommended stays (budget to luxury) matching the ${data.budget.currency} ${hotelBudgetPerDay}/night ceiling.
    ${['flight', 'train', 'bus'].includes(transportMode) ? '* transport_bookings: (Day 1 only) 3 booking options/apps' : ''}

CRITICAL: Return ONLY valid JSON with a root object containing "concepts": [ concept1, concept2, concept3 ].`;
}

export function buildSearchQuery(data: OnboardingData, category: string): string {
  const toLocation = getLocationString(data.destination.to);
  const duration = calculateDuration(data.dates.startDate, data.dates.endDate);
  const hotelBudgetPerDay = calculateHotelBudgetPerDay(data.budget.amount, duration);

  const queries: Record<string, string> = {
    activities: `Top attractions, hidden gems, and scenic spots in ${toLocation} for ${data.preferences.pace} pace and ${data.preferences.interests.join(' ')}`,
    restaurants: `Top recommended cafes, authentic local bistros, and fine dining restaurants in ${toLocation}`,
    hotels: `Top rated hotels and boutique stays in ${toLocation} under ${data.budget.currency} ${hotelBudgetPerDay} per night`,
  };
  return queries[category] || '';
}

function calculateDuration(start: string, end: string): number {
  const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });
}

function calculateHotelBudgetPerDay(totalBudget: number, days: number): number {
  return Math.floor((totalBudget * 0.6) / Math.max(1, days));
}
