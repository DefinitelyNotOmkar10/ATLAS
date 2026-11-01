"use client";

import { useCallback, useEffect, useState } from "react";

export type LocationIndex = {
  countries: string[];
  statesByCountry: Map<string, string[]>;
  citiesByCountryState: Map<string, string[]>;
};

const CSV_PATHS = {
  countries: "/CSV/countries.csv",
  states: "/CSV/states.csv",
  cities: "/CSV/cities.csv",
} as const;

const makeKey = (country: string, state: string) => `${country}||${state}`;

// Minimal CSV parser that handles quoted fields and escaped quotes.
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      if (text[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const buildHeaderIndex = (headers: string[]): Map<string, number> => {
  const map = new Map<string, number>();
  headers.forEach((header, index) => {
    map.set(header.trim(), index);
  });
  return map;
};

const requireHeader = (headerIndex: Map<string, number>, name: string, source: string): number => {
  const index = headerIndex.get(name);
  if (index === undefined) {
    throw new Error(`Missing ${name} column in ${source}`);
  }
  return index;
};

const toSortedArrayMap = (map: Map<string, Set<string>>): Map<string, string[]> => {
  const result = new Map<string, string[]>();
  for (const [key, set] of map.entries()) {
    const values = Array.from(set);
    values.sort((a, b) => a.localeCompare(b));
    result.set(key, values);
  }
  return result;
};

const buildLocationIndex = async (): Promise<LocationIndex> => {
  const [countriesText, statesText, citiesText] = await Promise.all(
    Object.values(CSV_PATHS).map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return response.text();
    })
  );

  const countryRows = parseCsv(countriesText);
  if (countryRows.length === 0) {
    throw new Error("Countries CSV is empty");
  }
  const countryHeaderIndex = buildHeaderIndex(countryRows[0]);
  const countryIdIndex = requireHeader(countryHeaderIndex, "id", "countries.csv");
  const countryNameIndex = requireHeader(countryHeaderIndex, "name", "countries.csv");

  const countryById = new Map<string, string>();
  for (let i = 1; i < countryRows.length; i += 1) {
    const row = countryRows[i];
    const id = row[countryIdIndex]?.trim();
    const name = row[countryNameIndex]?.trim();
    if (id && name) {
      countryById.set(id, name);
    }
  }

  const stateRows = parseCsv(statesText);
  if (stateRows.length === 0) {
    throw new Error("States CSV is empty");
  }
  const stateHeaderIndex = buildHeaderIndex(stateRows[0]);
  const stateIdIndex = requireHeader(stateHeaderIndex, "id", "states.csv");
  const stateNameIndex = requireHeader(stateHeaderIndex, "name", "states.csv");
  const stateCountryIdIndex = requireHeader(stateHeaderIndex, "country_id", "states.csv");

  const statesByCountry = new Map<string, Set<string>>();
  const stateById = new Map<string, { name: string; countryName: string }>();

  for (let i = 1; i < stateRows.length; i += 1) {
    const row = stateRows[i];
    const stateId = row[stateIdIndex]?.trim();
    const stateName = row[stateNameIndex]?.trim();
    const countryId = row[stateCountryIdIndex]?.trim();
    const countryName = countryId ? countryById.get(countryId) : undefined;

    if (!stateId || !stateName || !countryName) {
      continue;
    }

    stateById.set(stateId, { name: stateName, countryName });

    const states = statesByCountry.get(countryName) ?? new Set<string>();
    states.add(stateName);
    statesByCountry.set(countryName, states);
  }

  const cityRows = parseCsv(citiesText);
  if (cityRows.length === 0) {
    throw new Error("Cities CSV is empty");
  }
  const cityHeaderIndex = buildHeaderIndex(cityRows[0]);
  const cityNameIndex = requireHeader(cityHeaderIndex, "name", "cities.csv");
  const cityStateIdIndex = requireHeader(cityHeaderIndex, "state_id", "cities.csv");

  const citiesByCountryState = new Map<string, Set<string>>();

  for (let i = 1; i < cityRows.length; i += 1) {
    const row = cityRows[i];
    const cityName = row[cityNameIndex]?.trim();
    const stateId = row[cityStateIdIndex]?.trim();
    const state = stateId ? stateById.get(stateId) : undefined;

    if (!cityName || !state) {
      continue;
    }

    const key = makeKey(state.countryName, state.name);
    const cities = citiesByCountryState.get(key) ?? new Set<string>();
    cities.add(cityName);
    citiesByCountryState.set(key, cities);
  }

  const countries = Array.from(countryById.values()).sort((a, b) => a.localeCompare(b));

  return {
    countries,
    statesByCountry: toSortedArrayMap(statesByCountry),
    citiesByCountryState: toSortedArrayMap(citiesByCountryState),
  };
};

let cachedIndex: LocationIndex | null = null;
let cachedIndexPromise: Promise<LocationIndex> | null = null;

const loadLocationIndex = async (): Promise<LocationIndex> => {
  if (cachedIndex) {
    return cachedIndex;
  }
  if (!cachedIndexPromise) {
    cachedIndexPromise = buildLocationIndex();
  }
  cachedIndex = await cachedIndexPromise;
  return cachedIndex;
};

export const useLocationData = () => {
  const [index, setIndex] = useState<LocationIndex | null>(cachedIndex);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (index) {
      return () => {
        active = false;
      };
    }

    loadLocationIndex()
      .then((loaded) => {
        if (active) {
          setIndex(loaded);
        }
      })
      .catch((err: unknown) => {
        console.error("Location CSV load failed", err);
        if (active) {
          setError("Unable to load location data");
        }
      });

    return () => {
      active = false;
    };
  }, [index]);

  const getStatesByCountry = useCallback(
    (countryName: string) => index?.statesByCountry.get(countryName) ?? [],
    [index]
  );

  const getCitiesByState = useCallback(
    (countryName: string, stateName: string) =>
      index?.citiesByCountryState.get(makeKey(countryName, stateName)) ?? [],
    [index]
  );

  return {
    countries: index?.countries ?? [],
    getStatesByCountry,
    getCitiesByState,
    loading: !index && !error,
    error,
  };
};

export const filterOptions = (options: string[], searchTerm: string): string[] => {
  if (!searchTerm.trim()) return options;

  const lowerSearch = searchTerm.toLowerCase();
  return options.filter((option) => option.toLowerCase().includes(lowerSearch));
};
