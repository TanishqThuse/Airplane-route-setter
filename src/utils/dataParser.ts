// /utils/dataParser.ts

import { City, Flight } from "@/types/flight";

interface ParsedData {
  cities: City[];
  flights: Flight[];
}

/**
 * Parses a string input (like the format in the Java examples) into City and Flight objects.
 * Expects the format:
 * N (number of cities)
 * City1
 * City2
 * ...
 * M (number of flights)
 * Flight_details_1 (airline flightNumber srcCity destCity cost duration depTime arrTime twoWay[Y/N])
 * ...
 */
export function parseFlightData(rawData: string): ParsedData {
  const lines = rawData.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  if (lines.length === 0) {
    return { cities: [], flights: [] };
  }

  try {
    let currentLine = 0;

    // 1. Parse Cities
    const numCities = parseInt(lines[currentLine++]);
    if (isNaN(numCities)) throw new Error("Could not parse number of cities.");
    
    const cityNames: string[] = [];
    for (let i = 0; i < numCities; i++) {
      if (currentLine >= lines.length) throw new Error("Missing city names.");
      cityNames.push(lines[currentLine++]);
    }

    const cities: City[] = cityNames.map(name => ({
      id: name, // Using name as ID for simplicity in parsing
      name: name
    }));

    // 2. Parse Flights
    if (currentLine >= lines.length) throw new Error("Missing number of flights.");
    const numFlights = parseInt(lines[currentLine++]);
    if (isNaN(numFlights)) throw new Error("Could not parse number of flights.");
    
    const flights: Flight[] = [];
    for (let i = 0; i < numFlights; i++) {
      if (currentLine >= lines.length) throw new Error(`Missing details for flight ${i + 1}.`);
      const parts = lines[currentLine++].split(/\s+/);

      if (parts.length !== 9) {
        // Skip lines that look like source/destination cities at the end of the block
        // or other non-flight lines if they don't have 9 parts.
        continue;
      }

      const [
        airline,
        flightNumber,
        src,
        dest,
        costStr,
        durationStr,
        depTime,
        arrTime,
        isTwoWayStr
      ] = parts;

      const cost = parseInt(costStr);
      const duration = parseInt(durationStr);
      const isTwoWay = isTwoWayStr.toUpperCase() === 'Y';

      if (isNaN(cost) || isNaN(duration) || !cityNames.includes(src) || !cityNames.includes(dest)) {
        console.warn(`Skipping invalid flight line: ${lines[currentLine-1]}`);
        continue;
      }

      flights.push({
        id: `${Date.now()}-${i}`,
        airline,
        flightNumber,
        src,
        dest,
        cost,
        duration,
        depTime,
        arrTime,
        isTwoWay,
      });
    }

    return { cities, flights };
  } catch (error) {
    console.error("Parsing Error:", error);
    return { cities: [], flights: [] }; // Return empty data on error
  }
}