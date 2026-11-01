import { NextRequest } from 'next/server';
import { searchGemini, generateWithGemini } from '@/lib/services/gemini';
import { buildItineraryPrompt, buildSearchQuery } from '@/lib/utils/promptBuilder';
import { OnboardingData } from '@/lib/types/onboarding';
import { ItineraryConcept, ItineraryResponse } from '@/lib/types/itinerary';

export async function POST(request: NextRequest) {
  try {
    const onboardingData: OnboardingData = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please set GEMINI_API_KEY in .env.local' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating multi-concept itineraries for:', {
      destination: onboardingData.destination,
      dates: onboardingData.dates,
      travelers: onboardingData.travelers
    });

    // Run parallel searches for rich real-time context
    const [activitiesData, restaurantsData, hotelsData] = await Promise.all([
      searchGemini(buildSearchQuery(onboardingData, 'activities')),
      searchGemini(buildSearchQuery(onboardingData, 'restaurants')),
      searchGemini(buildSearchQuery(onboardingData, 'hotels')),
    ]);

    const systemPrompt = `You are an elite travel intelligence architect. Your ONLY job is to return a valid JSON object containing 3 curated itinerary concepts under a "concepts" array. No other text, no markdown, ONLY valid JSON.`;

    const userPrompt = `${buildItineraryPrompt(onboardingData)}

REAL-TIME GROUNDING DATA:
Activities Context: ${JSON.stringify(activitiesData)}
Dining Context: ${JSON.stringify(restaurantsData)}
Hotels Context: ${JSON.stringify(hotelsData)}

CRITICAL: Return valid JSON in this exact structure:
{
  "concepts": [
    {
      "id": "iconic",
      "title": "The Iconic Highlights Expedition",
      "tagline": "Signature landmarks, quintessential sights, and celebrated cultural heritage.",
      "theme": "Classic & Must-See Heritage",
      "badge": "Most Popular",
      "highlights": ["Iconic Landmark 1", "Signature Activity 2", "Celebrated Savor 3"],
      "estimated_daily_pace": "Balanced (3-4 sights/day)",
      "days": [
        {
          "day": 1,
          "date": "2026-09-01",
          "morning": { "name": "Morning Activity", "description": "...", "duration": "2.5 hours", "estimated_cost": 1000 },
          "afternoon": { "name": "Afternoon Activity", "description": "...", "duration": "3 hours", "estimated_cost": 1500 },
          "evening": { "name": "Evening Activity", "description": "...", "duration": "2 hours", "estimated_cost": 800 },
          "meals": [
            { "type": "Breakfast", "name": "Cafe Name", "cuisine": "Local/Continental", "price_range": "INR 300-500", "location": "Area" },
            { "type": "Lunch", "name": "Bistro Name", "cuisine": "Signature Regional", "price_range": "INR 500-800", "location": "Area" },
            { "type": "Dinner", "name": "Restaurant Name", "cuisine": "Fine/Local", "price_range": "INR 800-1500", "location": "Area" }
          ],
          "hotels": [
            { "name": "Hotel Name", "type": "Boutique/Luxury", "price_per_night": 3000, "price_per_night_display": "INR 3000 / night", "location": "Area", "amenities": ["WiFi", "Breakfast"] }
          ]
        }
      ]
    },
    {
      "id": "hidden_gems",
      "title": "Secret Spots & Artisan Trail",
      "tagline": "Secluded alleyways, local neighborhood markets, and bohemian culinary gems.",
      "theme": "Off-The-Beaten-Path Discovery",
      "badge": "Explorer Choice",
      "highlights": ["Hidden Courtyard", "Artisan Quarter Walk", "Secret Panoramic View"],
      "estimated_daily_pace": "Immersive & Experiential",
      "days": [ ... ]
    },
    {
      "id": "luxury_leisure",
      "title": "Scenic Leisure & Indulgence",
      "tagline": "Rooftop golden hours, scenic vistas, and unhurried boutique dining.",
      "theme": "VIP Leisure & Fine Living",
      "badge": "Luxury Tier",
      "highlights": ["Sunset Rooftop Lounge", "Scenic Waterfront Retreat", "Signature Tasting Menu"],
      "estimated_daily_pace": "Unhurried & Relaxed",
      "days": [ ... ]
    }
  ]
}`;

    console.log('Calling Gemini AI for multi-concept generation...');
    const responseText = await generateWithGemini(userPrompt, systemPrompt);
    console.log('Received response length:', responseText.length);

    let parsedData: any;
    try {
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }

      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON from AI response:', parseError);
      console.error('Raw response:', responseText);
      throw new Error('AI returned an invalid JSON response structure');
    }

    // Normalize output: Ensure concepts array exists
    let finalResponse: ItineraryResponse;
    if (parsedData.concepts && Array.isArray(parsedData.concepts) && parsedData.concepts.length > 0) {
      finalResponse = {
        tripSummary: {
          destination: onboardingData.destination.to.city || onboardingData.destination.to.country,
          duration: parsedData.concepts[0]?.days?.length || 1,
          totalEstimatedCost: `${onboardingData.budget.currency} ${onboardingData.budget.amount.toLocaleString()}`,
        },
        concepts: parsedData.concepts,
        days: parsedData.concepts[0].days,
        journey_stops: parsedData.concepts[0].journey_stops || parsedData.journey_stops,
      };
    } else if (parsedData.days && Array.isArray(parsedData.days)) {
      // Single itinerary legacy fallback: wrap into 3 concepts
      const defaultDays = parsedData.days;
      finalResponse = {
        tripSummary: {
          destination: onboardingData.destination.to.city || onboardingData.destination.to.country,
          duration: defaultDays.length,
          totalEstimatedCost: `${onboardingData.budget.currency} ${onboardingData.budget.amount.toLocaleString()}`,
        },
        concepts: [
          {
            id: 'iconic',
            title: 'The Iconic Highlights Expedition',
            tagline: 'Signature sights, celebrated landmarks, and essential culture.',
            theme: 'Classic & Must-See Heritage',
            badge: 'Most Popular',
            highlights: ['Signature Landmarks', 'Cultural Highlights', 'Historic Architecture'],
            estimated_daily_pace: 'Balanced (3-4 sights/day)',
            days: defaultDays,
            journey_stops: parsedData.journey_stops,
          },
          {
            id: 'hidden_gems',
            title: 'Secret Spots & Artisan Trail',
            tagline: 'Secluded neighborhood alleyways, artisan markets, and local flavors.',
            theme: 'Off-The-Beaten-Path Discovery',
            badge: 'Explorer Choice',
            highlights: ['Secret Courtyards', 'Artisan Quarters', 'Authentic Local Spots'],
            estimated_daily_pace: 'Immersive & Experiential',
            days: defaultDays,
            journey_stops: parsedData.journey_stops,
          },
          {
            id: 'luxury_leisure',
            title: 'Scenic Leisure & Indulgence',
            tagline: 'Rooftop golden hours, scenic vistas, and unhurried dining.',
            theme: 'VIP Leisure & Fine Living',
            badge: 'Luxury Tier',
            highlights: ['Rooftop Lounges', 'Scenic Vista Points', 'Fine Dining'],
            estimated_daily_pace: 'Unhurried & Relaxed',
            days: defaultDays,
            journey_stops: parsedData.journey_stops,
          },
        ],
        days: defaultDays,
        journey_stops: parsedData.journey_stops,
      };
    } else {
      throw new Error('AI returned an unrecognized itinerary format');
    }

    return new Response(JSON.stringify(finalResponse), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Itinerary generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate itinerary concepts';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
