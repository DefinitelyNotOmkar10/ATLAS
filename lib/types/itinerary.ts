export interface DayItinerary {
  day: number;
  date: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  meals: MealSpot[];
  hotels: HotelSuggestion[];
  transport_bookings?: TransportBooking[];
}

export interface TransportBooking {
  name: string;
  type: string;
  website: string;
  description: string;
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  estimated_cost: number;
}

export interface MealSpot {
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  name: string;
  cuisine: string;
  price_range: string;
  location: string;
}

export interface HotelSuggestion {
  name: string;
  type: string;
  price_per_night: number | string; // Support both formats for backward compatibility
  price_per_night_display?: string; // New format with display string
  location: string;
  amenities: string[];
}

export interface JourneyStop {
  name: string;
  location: string;
  description: string;
  estimated_time: string;
  activities: string[];
}

export interface ItineraryConcept {
  id: string; // 'iconic' | 'hidden_gems' | 'luxury_leisure'
  title: string;
  theme: string;
  tagline: string;
  badge: string;
  highlights: string[];
  estimated_daily_pace: string;
  cover_image?: string;
  days: DayItinerary[];
  journey_stops?: JourneyStop[];
}

export interface ItineraryResponse {
  tripSummary?: {
    destination: string;
    duration: number;
    totalEstimatedCost: string;
  };
  concepts?: ItineraryConcept[];
  journey_stops?: JourneyStop[];
  days?: DayItinerary[];
}
