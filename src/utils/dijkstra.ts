import { Flight, RouteResult } from "@/types/flight";

interface Node {
  city: string;
  cost: number;
  duration: number;
  path: Flight[];
}

export function findOptimalRoute(
  cities: string[],
  flights: Flight[],
  source: string,
  destination: string
): RouteResult | null {
  const cityIndex = new Map<string, number>();
  cities.forEach((city, idx) => cityIndex.set(city, idx));

  const n = cities.length;
  const adj: Flight[][] = Array.from({ length: n }, () => []);

  // Build adjacency list
  flights.forEach((flight) => {
    const srcIdx = cityIndex.get(flight.src);
    const destIdx = cityIndex.get(flight.dest);
    if (srcIdx !== undefined && destIdx !== undefined) {
      adj[srcIdx].push(flight);
      if (flight.isTwoWay) {
        adj[destIdx].push({
          ...flight,
          src: flight.dest,
          dest: flight.src,
          depTime: flight.arrTime,
          arrTime: flight.depTime,
        });
      }
    }
  });

  const srcIdx = cityIndex.get(source);
  const destIdx = cityIndex.get(destination);

  if (srcIdx === undefined || destIdx === undefined) {
    return null;
  }

  // Dijkstra's algorithm
  const dist = new Array(n).fill(Infinity);
  dist[srcIdx] = 0;

  const pq: Node[] = [{ city: source, cost: 0, duration: 0, path: [] }];
  const visited = new Set<number>();

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const curr = pq.shift()!;
    const currIdx = cityIndex.get(curr.city)!;

    if (visited.has(currIdx)) continue;
    visited.add(currIdx);

    if (curr.city === destination) {
      return {
        totalCost: curr.cost,
        totalDuration: curr.duration,
        path: curr.path,
      };
    }

    adj[currIdx].forEach((flight) => {
      const destIdx = cityIndex.get(flight.dest)!;
      if (!visited.has(destIdx) && dist[currIdx] + flight.cost < dist[destIdx]) {
        dist[destIdx] = dist[currIdx] + flight.cost;
        pq.push({
          city: flight.dest,
          cost: dist[destIdx],
          duration: curr.duration + flight.duration,
          path: [...curr.path, flight],
        });
      }
    });
  }

  return null;
}
