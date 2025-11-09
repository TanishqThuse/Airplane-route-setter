import { useState } from "react";
import { City } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface CityManagerProps {
  cities: City[];
  onAddCity: (city: City) => void;
  onRemoveCity: (id: string) => void;
}

export function CityManager({ cities, onAddCity, onRemoveCity }: CityManagerProps) {
  const [cityName, setCityName] = useState("");

  const handleAddCity = () => {
    if (!cityName.trim()) {
      toast.error("Please enter a city name");
      return;
    }
    
    if (cities.some(c => c.name.toLowerCase() === cityName.toLowerCase())) {
      toast.error("City already exists");
      return;
    }

    const newCity: City = {
      id: Date.now().toString(),
      name: cityName.trim(),
    };
    onAddCity(newCity);
    setCityName("");
    toast.success(`${cityName} added successfully`);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          City Network
        </CardTitle>
        <CardDescription>
          Add cities to build your airline route network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCity()}
            className="flex-1"
          />
          <Button onClick={handleAddCity} className="bg-gradient-sky">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {cities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No cities added yet</p>
          ) : (
            cities.map((city) => (
              <div
                key={city.id}
                className="flex items-center gap-2 bg-sky-light px-3 py-1.5 rounded-full border border-primary/20 transition-smooth hover:shadow-soft"
              >
                <span className="text-sm font-medium text-navy">{city.name}</span>
                <button
                  onClick={() => onRemoveCity(city.id)}
                  className="text-destructive hover:text-destructive/80 transition-smooth"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
