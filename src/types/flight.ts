export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  src: string;
  dest: string;
  cost: number;
  duration: number;
  depTime: string;
  arrTime: string;
  isTwoWay: boolean;
}

export interface City {
  id: string;
  name: string;
}

export interface RouteResult {
  totalCost: number;
  totalDuration: number;
  path: Flight[];
}
