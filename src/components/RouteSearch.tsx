import { useState } from "react";
import { City } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface RouteSearchProps {
  cities: City[];
  onSearch: (source: string, destination: string) => void;
}

export function RouteSearch({ cities, onSearch }: RouteSearchProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (!source || !destination) {
      toast.error("Please select both source and destination");
      return;
    }

    if (source === destination) {
      toast.error("Source and destination must be different");
      return;
    }

    onSearch(source, destination);
  };

  if (cities.length < 2) {
    return null;
  }

  return (
    <Card className="shadow-medium border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Find Optimal Route
        </CardTitle>
        <CardDescription>
          Search for the most cost-effective flight path
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select source city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex items-center justify-center pb-2">
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full bg-gradient-sky shadow-medium hover:shadow-large transition-smooth">
          <Search className="w-4 h-4 mr-2" />
          Search Routes
        </Button>
      </CardContent>
    </Card>
  );
}
