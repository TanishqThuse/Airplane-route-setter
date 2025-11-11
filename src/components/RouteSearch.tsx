import { useState } from "react";
import { City, OptimizationPriority, CustomWeights } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, ArrowRight, DollarSign, Clock, MapPin, Sliders } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface RouteSearchProps {
  cities: City[];
  onSearch: (source: string, destination: string, priority: OptimizationPriority, customWeights?: CustomWeights) => void;
}

export function RouteSearch({ cities, onSearch }: RouteSearchProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [priority, setPriority] = useState<OptimizationPriority>('cost');
  const [customWeights, setCustomWeights] = useState<CustomWeights>({
    cost: 33,
    time: 33,
    distance: 34
  });

  const handleSearch = () => {
    if (!source || !destination) {
      toast.error("Please select both source and destination");
      return;
    }

    if (source === destination) {
      toast.error("Source and destination must be different");
      return;
    }

    if (priority === 'custom') {
      const total = customWeights.cost + customWeights.time + customWeights.distance;
      if (total !== 100) {
        toast.error("Custom weights must sum to 100%");
        return;
      }
      onSearch(source, destination, priority, customWeights);
    } else {
      onSearch(source, destination, priority);
    }
  };

  const updateWeight = (field: keyof CustomWeights, value: number) => {
    setCustomWeights(prev => {
      const newWeights = { ...prev, [field]: value };
      const total = newWeights.cost + newWeights.time + newWeights.distance;
      
      // Auto-adjust other fields proportionally if total exceeds 100
      if (total > 100) {
        const excess = total - 100;
        const otherFields = (Object.keys(prev) as Array<keyof CustomWeights>).filter(k => k !== field);
        otherFields.forEach(key => {
          newWeights[key] = Math.max(0, newWeights[key] - excess / otherFields.length);
        });
      }
      
      return newWeights;
    });
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cost" className="gap-1.5 text-xs">
                <DollarSign className="w-4 h-4" />
                Cost
              </TabsTrigger>
              <TabsTrigger value="time" className="gap-1.5 text-xs">
                <Clock className="w-4 h-4" />
                Time
              </TabsTrigger>
              <TabsTrigger value="distance" className="gap-1.5 text-xs">
                <MapPin className="w-4 h-4" />
                Distance
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-1.5 text-xs">
                <Sliders className="w-4 h-4" />
                Custom
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {priority !== 'custom' ? (
            <p className="text-xs text-muted-foreground">
              {priority === 'cost' && 'Find the most economical route'}
              {priority === 'time' && 'Find the fastest route'}
              {priority === 'distance' && 'Find the shortest distance route'}
            </p>
          ) : (
            <div className="space-y-4 pt-2 pb-1">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Cost Priority</Label>
                  <span className="text-sm font-medium text-primary">{customWeights.cost}%</span>
                </div>
                <Slider
                  value={[customWeights.cost]}
                  onValueChange={(v) => updateWeight('cost', v[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Time Priority</Label>
                  <span className="text-sm font-medium text-primary">{customWeights.time}%</span>
                </div>
                <Slider
                  value={[customWeights.time]}
                  onValueChange={(v) => updateWeight('time', v[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Distance Priority</Label>
                  <span className="text-sm font-medium text-primary">{customWeights.distance}%</span>
                </div>
                <Slider
                  value={[customWeights.distance]}
                  onValueChange={(v) => updateWeight('distance', v[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Total:</span>
                <span className={`font-medium ${customWeights.cost + customWeights.time + customWeights.distance === 100 ? 'text-primary' : 'text-destructive'}`}>
                  {customWeights.cost + customWeights.time + customWeights.distance}%
                </span>
              </div>
            </div>
          )}
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
