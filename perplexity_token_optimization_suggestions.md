# Perplexity Token Optimization Suggestions

## Overview
This document summarizes recommendations to reduce token usage, API costs, and improve efficiency in the itinerary generation pipeline using Perplexity AI.

---

# Main Token-Heavy Problems

## 1. Full Search JSON Embedded in Prompts
Current implementation injects:
```ts
REAL-TIME DATA: Activities: ${JSON.stringify(activitiesData)}
```

This massively increases input tokens.

### Fix
- Only include summarized results.
- Use top 3-5 bullets.
- Include only important URLs/citations.

---

## 2. Verbose Prompt Examples
Large examples and repeated JSON schemas consume tokens unnecessarily.

### Fix
- Shorten examples.
- Keep only essential formatting instructions.
- Avoid repeated schema explanations.

---

## 3. No Output Token Limits
Generation requests currently lack `max_tokens`.

### Fix
Add dynamic token limits:
```ts
max_tokens = base + days * tokensPerDay
```

Example:
- Concise mode → 200 tokens/day
- Verbose mode → 400 tokens/day

---

## 4. No Server-Side Cache
The app always performs fresh Perplexity requests.

### Fix
Add:
- Redis cache
- In-memory LRU cache
- Cache search summaries
- Cache final itineraries

---

## 5. Large Free-Text Outputs
Very long descriptions are generated for activities and itinerary sections.

### Fix
Enforce:
- 20–30 word limits
- Compact descriptions
- Short summaries

---

# High Priority Optimizations

## A. Summarize Search Results Before Final Prompt

### Replace This
```ts
JSON.stringify(activitiesData)
```

### With This
```ts
shortSummaryFromSearch(activitiesData)
```

### Example Helper
```ts
function shortSummaryFromSearch(searchResult, maxBullets = 3) {
  const txt = searchResult.answer || "";
  const sentences = txt.split(/[.?!]\s+/).filter(Boolean);

  const chosen = sentences
    .slice(0, maxBullets)
    .map(s => s.trim());

  const citations = (searchResult.citations || [])
    .slice(0,2)
    .map(c => c.url);

  return {
    bullets: chosen,
    citations
  };
}
```

---

# Output Token Control

## Add `max_tokens`

### Example
```ts
body: JSON.stringify({
  model,
  messages,
  max_tokens: maxTokens
})
```

---

# Dynamic Token Formula

```ts
const days = calculateDuration(startDate, endDate);

const tokensPerDay = conciseMode ? 200 : 400;

const maxOutputTokens =
  Math.min(
    8000,
    Math.max(800, 400 + days * tokensPerDay)
  );
```

---

# Compact JSON Strategy

## Use Short Keys

### Example
| Full Key | Compact Key |
|---|---|
| morning | m |
| afternoon | a |
| evening | e |
| meals | ms |
| hotels | hs |
| transport_bookings | tb |

---

# Expand Compact JSON Server-Side

```ts
function expandCompact(compact) {
  return {
    days: compact.d.map(day => ({
      morning: day.m,
      afternoon: day.a,
      evening: day.e,
      meals: day.ms
    }))
  };
}
```

---

# Server-Side Cache Strategy

## Cache Flow
1. Generate deterministic cache key.
2. Check itinerary cache.
3. Reuse search summaries.
4. Store final itinerary.

### Suggested TTL
- 24–72 hours

---

# Lazy Expansion Strategy

Generate concise itineraries initially.

When users expand activities:
- Fetch detailed description on demand.

### Benefits
- Massive token reduction
- Faster initial load
- Better UX

---

# Token Estimation Before Requests

## Add Pre-Flight Token Counter

### Example
```ts
import encode from 'gpt-3-encoder';

function estimateTokens(text) {
  return encode(text).length;
}
```

### Benefits
- Prevent oversized prompts
- Auto-truncate when needed
- Better cost prediction

---

# Model Strategy

## Recommended Flow
### Cheap Model
Use for:
- candidate generation
- drafts
- summaries

### Expensive Model
Use only for:
- final polished itinerary
- premium export

---

# Practical Token Heuristics

| Mode | Tokens/Day |
|---|---|
| Concise | 150–250 |
| Verbose | 350–500 |

### Example
5-day concise trip:
```txt
300 + (5 * 200) = ~1300 tokens
```

Recommended:
```txt
max_tokens ≈ 1500
```

---

# Recommended Implementation Checklist

## Immediate Changes
- [ ] Add `max_tokens`
- [ ] Summarize search results
- [ ] Remove raw JSON embedding
- [ ] Add concise mode
- [ ] Add token estimation
- [ ] Add server cache

---

# Advanced Improvements

## Expand-on-Demand Endpoint
Create:
```txt
POST /api/expand-activity
```

Returns:
- detailed paragraph
- specific activity details
- only when user requests

---

# Expected Benefits

## Token Savings
- Huge reduction in input tokens
- Smaller outputs
- Lower API costs

## Performance
- Faster responses
- Better scalability
- Lower latency

## UX
- Cleaner outputs
- Faster loading
- Progressive detail loading

---

# Suggested Rollout Order

## Phase 1
1. Add `max_tokens`
2. Summarize search data
3. Add concise mode

## Phase 2
4. Add caching
5. Add token estimator
6. Compact JSON format

## Phase 3
7. Expand-on-demand
8. Multi-model pipeline
9. Advanced heuristics

---
