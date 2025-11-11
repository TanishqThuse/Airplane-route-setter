import { Flight, RouteResult, OptimizationPriority, CustomWeights } from "@/types/flight";

interface Node {
  city: string;
  cost: number;
  duration: number;
  distance: number;
  path: Flight[];
}

export function findOptimalRoute(
  cities: string[],
  flights: Flight[],
  source: string,
  destination: string,
  priority: OptimizationPriority = 'cost',
  customWeights?: CustomWeights
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

  // Helper to get metric value based on priority
  const getMetric = (flight: Flight): number => {
    if (priority === 'custom' && customWeights) {
      // Calculate weighted sum: normalize each metric and apply weight
      const normalizedCost = flight.cost / 1000; // Assuming max cost ~1000
      const normalizedTime = flight.duration / 500; // Assuming max duration ~500 min
      const normalizedDistance = (flight.distance || flight.duration * 10) / 5000; // Assuming max ~5000km
      
      return (
        normalizedCost * (customWeights.cost / 100) +
        normalizedTime * (customWeights.time / 100) +
        normalizedDistance * (customWeights.distance / 100)
      );
    }
    
    switch (priority) {
      case 'cost':
        return flight.cost;
      case 'time':
        return flight.duration;
      case 'distance':
        return flight.distance || flight.duration * 10; // Default: 10km per minute
      default:
        return flight.cost;
    }
  };

  // Dijkstra's algorithm
  const dist = new Array(n).fill(Infinity);
  dist[srcIdx] = 0;

  const pq: Node[] = [{ city: source, cost: 0, duration: 0, distance: 0, path: [] }];
  const visited = new Set<number>();

  while (pq.length > 0) {
    // Sort by the chosen priority metric
    pq.sort((a, b) => {
      if (priority === 'custom' && customWeights) {
        const getNodeMetric = (node: Node) => {
          const normalizedCost = node.cost / 1000;
          const normalizedTime = node.duration / 500;
          const normalizedDistance = node.distance / 5000;
          return (
            normalizedCost * (customWeights.cost / 100) +
            normalizedTime * (customWeights.time / 100) +
            normalizedDistance * (customWeights.distance / 100)
          );
        };
        return getNodeMetric(a) - getNodeMetric(b);
      }
      
      switch (priority) {
        case 'cost':
          return a.cost - b.cost;
        case 'time':
          return a.duration - b.duration;
        case 'distance':
          return a.distance - b.distance;
        default:
          return a.cost - b.cost;
      }
    });
    
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
      const metric = getMetric(flight);
      const currMetric = priority === 'cost' ? curr.cost : priority === 'time' ? curr.duration : curr.distance;
      
      if (!visited.has(destIdx) && dist[currIdx] + metric < dist[destIdx]) {
        dist[destIdx] = dist[currIdx] + metric;
        pq.push({
          city: flight.dest,
          cost: curr.cost + flight.cost,
          duration: curr.duration + flight.duration,
          distance: curr.distance + (flight.distance || flight.duration * 10),
          path: [...curr.path, flight],
        });
      }
    });
  }

  return null;
}
