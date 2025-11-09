import { useState } from "react";
import { City, Flight, RouteResult } from "@/types/flight";
import { CityManager } from "@/components/CityManager";
import { FlightManager } from "@/components/FlightManager";
import { RouteSearch } from "@/components/RouteSearch";
import { RouteResults } from "@/components/RouteResults";
import { findOptimalRoute } from "@/utils/dijkstra";
import { Plane } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchResult, setSearchResult] = useState<{
    result: RouteResult | null;
    source: string;
    destination: string;
  } | null>(null);

  const handleAddCity = (city: City) => {
    setCities([...cities, city]);
  };

  const handleRemoveCity = (id: string) => {
    const city = cities.find(c => c.id === id);
    if (city) {
      // Remove associated flights
      setFlights(flights.filter(f => f.src !== city.name && f.dest !== city.name));
      setCities(cities.filter(c => c.id !== id));
      toast.success(`${city.name} removed`);
    }
  };

  const handleAddFlight = (flight: Flight) => {
    setFlights([...flights, flight]);
  };

  const handleSearch = (source: string, destination: string) => {
    if (flights.length === 0) {
      toast.error("Please add some flights first");
      return;
    }

    const result = findOptimalRoute(
      cities.map(c => c.name),
      flights,
      source,
      destination
    );

    setSearchResult({ result, source, destination });

    if (result) {
      toast.success("Optimal route found!");
    } else {
      toast.error("No route available");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-sky text-primary-foreground shadow-large">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <Plane className="w-10 h-10" />
            <div>
              <h1 className="text-4xl font-bold">Airline Route Optimizer</h1>
              <p className="text-primary-foreground/90 mt-1">
                Find the most cost-effective flight paths using advanced graph algorithms
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CityManager
            cities={cities}
            onAddCity={handleAddCity}
            onRemoveCity={handleRemoveCity}
          />
          <FlightManager
            cities={cities}
            flights={flights}
            onAddFlight={handleAddFlight}
          />
        </div>

        {/* Search Section */}
        {cities.length >= 2 && flights.length > 0 && (
          <RouteSearch cities={cities} onSearch={handleSearch} />
        )}

        {/* Results Section */}
        {searchResult && (
          <RouteResults
            result={searchResult.result}
            source={searchResult.source}
            destination={searchResult.destination}
          />
        )}

        {/* Empty State */}
        {cities.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <Plane className="w-24 h-24 mx-auto text-muted-foreground opacity-50" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Start Building Your Route Network
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Add cities and flights to begin analyzing optimal airline routes using
                Dijkstra's shortest path algorithm
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Powered by Dijkstra's Algorithm • Graph-based Route Optimization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
