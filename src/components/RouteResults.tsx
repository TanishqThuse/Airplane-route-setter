import { RouteResult } from "@/types/flight";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, DollarSign, MapPin, ArrowRight } from "lucide-react";

interface RouteResultsProps {
  result: RouteResult | null;
  source: string;
  destination: string;
}

export function RouteResults({ result, source, destination }: RouteResultsProps) {
  if (!result) {
    return (
      <Card className="shadow-soft">
        <CardContent className="py-12">
          <div className="text-center space-y-2">
            <Plane className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              No route found between {source} and {destination}
            </p>
            <p className="text-sm text-muted-foreground">
              Try adding more connecting flights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hours = Math.floor(result.totalDuration / 60);
  const minutes = result.totalDuration % 60;

  return (
    <div className="space-y-6">
      <Card className="shadow-medium border-2 border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-success" />
            Optimal Route Found
          </CardTitle>
          <CardDescription>
            Best path from {source} to {destination}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-sky-light rounded-lg">
              <DollarSign className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-navy">{result.totalCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-sky-light rounded-lg">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="text-2xl font-bold text-navy">
                  {hours}h {minutes}m
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-sky-light rounded-lg">
              <Plane className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Flights</p>
                <p className="text-2xl font-bold text-navy">{result.path.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Flight Path</CardTitle>
          <CardDescription>Detailed itinerary for your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.path.map((flight, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-soft transition-smooth">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-sky text-primary-foreground font-bold">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-lg">
                        {flight.airline} {flight.flightNumber}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-orange text-accent-foreground">
                      ₹{flight.cost.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{flight.src}</span>
                      <span className="text-muted-foreground">{flight.depTime}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{flight.dest}</span>
                      <span className="text-muted-foreground">{flight.arrTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</span>
                  </div>
                </div>
              </div>

              {index < result.path.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-6 bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
