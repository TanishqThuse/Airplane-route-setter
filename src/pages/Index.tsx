import { useState } from "react";
import { City, Flight, RouteResult } from "@/types/flight";
import { CityManager } from "@/components/CityManager";
import { FlightManager } from "@/components/FlightManager";
import { RouteSearch } from "@/components/RouteSearch";
import { RouteResults } from "@/components/RouteResults";
import { MapVisualization } from "@/components/MapVisualization";
import { findOptimalRoute } from "@/utils/dijkstra";
import { Plane, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchResult, setSearchResult] = useState<{
    result: RouteResult | null;
    source: string;
    destination: string;
  } | null>(null);
  const [showOptimalPath, setShowOptimalPath] = useState(true);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-sky text-primary-foreground shadow-large">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Airline Route Optimizer</h1>
                <p className="text-primary-foreground/90 text-sm mt-1">
                  Interactive graph-based flight path analyzer
                </p>
              </div>
            </div>
            
            {/* Map Controls */}
            {searchResult?.result && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowOptimalPath(!showOptimalPath)}
                className="gap-2"
              >
                {showOptimalPath ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Hide Optimal Path
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Show Optimal Path
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-2/5 overflow-y-auto border-r border-border bg-background">
          <div className="p-4 space-y-6">
            {/* Input Section */}
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
              <div className="text-center py-12 space-y-4">
                <Plane className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Start Building Your Route Network
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Add cities and flights to visualize optimal routes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="hidden lg:block flex-1 bg-gradient-to-br from-sky-light/10 to-background p-4">
          <MapVisualization
            cities={cities}
            flights={flights}
            optimalRoute={searchResult?.result || null}
            showOptimalPath={showOptimalPath}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
