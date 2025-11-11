import { useState } from "react";
import { City, OptimizationPriority } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, ArrowRight, DollarSign, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RouteSearchProps {
  cities: City[];
  onSearch: (source: string, destination: string, priority: OptimizationPriority) => void;
}

export function RouteSearch({ cities, onSearch }: RouteSearchProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [priority, setPriority] = useState<OptimizationPriority>('cost');

  const handleSearch = () => {
    if (!source || !destination) {
      toast.error("Please select both source and destination");
      return;
    }

    if (source === destination) {
      toast.error("Source and destination must be different");
      return;
    }

    onSearch(source, destination, priority);
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
      <CardContent className="space-y-6">
        {/* Priority Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Optimization Priority</Label>
          <Tabs value={priority} onValueChange={(v) => setPriority(v as OptimizationPriority)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cost" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Cost
              </TabsTrigger>
              <TabsTrigger value="time" className="gap-2">
                <Clock className="w-4 h-4" />
                Time
              </TabsTrigger>
              <TabsTrigger value="distance" className="gap-2">
                <MapPin className="w-4 h-4" />
                Distance
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            {priority === 'cost' && 'Find the most economical route'}
            {priority === 'time' && 'Find the fastest route'}
            {priority === 'distance' && 'Find the shortest distance route'}
          </p>
        </div>

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
