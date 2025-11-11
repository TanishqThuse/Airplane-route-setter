// /types/flight.d.ts

export type OptimizationPriority = 'cost' | 'time' | 'distance' | 'custom';

export interface CustomWeights {
  cost: number;
  time: number;
  distance: number;
}

export interface City {
  id: string; // Used for React keys and internal management (e.g., Date.now().toString())
  name: string;
}

export interface Flight {
  id: string; // Used for React keys
  airline: string;
  flightNumber: string;
  src: string; // City name (string)
  dest: string; // City name (string)
  cost: number;
  duration: number; // in minutes
  distance?: number; // in km (optional, defaults to duration * 10)
  depTime: string; // e.g., "08:00"
  arrTime: string; // e.g., "10:00"
  isTwoWay: boolean;
}

export interface RouteResult {
  totalCost: number;
  totalDuration: number;
  path: Flight[];
}

// export interface Flight {
//   id: string;
//   airline: string;
//   flightNumber: string;
//   src: string;
//   dest: string;
//   cost: number;
//   duration: number;
//   depTime: string;
//   arrTime: string;
//   isTwoWay: boolean;
// }

// export interface City {
//   id: string;
//   name: string;
// }

// export interface RouteResult {
//   totalCost: number;
//   totalDuration: number;
//   path: Flight[];
// }
