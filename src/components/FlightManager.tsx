import { useState } from "react";
import { Flight, City } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plane, Plus } from "lucide-react";
import { toast } from "sonner";

interface FlightManagerProps {
  cities: City[];
  flights: Flight[];
  onAddFlight: (flight: Flight) => void;
}

export function FlightManager({ cities, flights, onAddFlight }: FlightManagerProps) {
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    src: "",
    dest: "",
    cost: "",
    duration: "",
    depTime: "",
    arrTime: "",
    isTwoWay: false,
  });

  const handleAddFlight = () => {
    if (!formData.airline || !formData.flightNumber || !formData.src || !formData.dest ||
        !formData.cost || !formData.duration || !formData.depTime || !formData.arrTime) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.src === formData.dest) {
      toast.error("Source and destination must be different");
      return;
    }

    const newFlight: Flight = {
      id: Date.now().toString(),
      airline: formData.airline,
      flightNumber: formData.flightNumber,
      src: formData.src,
      dest: formData.dest,
      cost: parseInt(formData.cost),
      duration: parseInt(formData.duration),
      depTime: formData.depTime,
      arrTime: formData.arrTime,
      isTwoWay: formData.isTwoWay,
    };

    onAddFlight(newFlight);
    setFormData({
      airline: "",
      flightNumber: "",
      src: "",
      dest: "",
      cost: "",
      duration: "",
      depTime: "",
      arrTime: "",
      isTwoWay: false,
    });
    toast.success("Flight added successfully");
  };

  if (cities.length < 2) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Flight Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Add at least 2 cities to create flight routes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          Flight Routes
        </CardTitle>
        <CardDescription>
          Add flight connections between cities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Airline</Label>
            <Input
              placeholder="e.g., Air India"
              value={formData.airline}
              onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Flight Number</Label>
            <Input
              placeholder="e.g., AI101"
              value={formData.flightNumber}
              onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Source City</Label>
            <Select value={formData.src} onValueChange={(value) => setFormData({ ...formData, src: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
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

          <div className="space-y-2">
            <Label>Destination City</Label>
            <Select value={formData.dest} onValueChange={(value) => setFormData({ ...formData, dest: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
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

          <div className="space-y-2">
            <Label>Cost (₹)</Label>
            <Input
              type="number"
              placeholder="5000"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              placeholder="120"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Departure Time</Label>
            <Input
              type="time"
              value={formData.depTime}
              onChange={(e) => setFormData({ ...formData, depTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Arrival Time</Label>
            <Input
              type="time"
              value={formData.arrTime}
              onChange={(e) => setFormData({ ...formData, arrTime: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="two-way"
              checked={formData.isTwoWay}
              onCheckedChange={(checked) => setFormData({ ...formData, isTwoWay: checked })}
            />
            <Label htmlFor="two-way" className="cursor-pointer">
              Two-way flight
            </Label>
          </div>

          <Button onClick={handleAddFlight} className="bg-gradient-sunset">
            <Plus className="w-4 h-4 mr-2" />
            Add Flight
          </Button>
        </div>

        {flights.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Added Flights ({flights.length})</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {flights.map((flight) => (
                <div
                  key={flight.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{flight.airline} {flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{flight.src}</span>
                    <span>→</span>
                    <span>{flight.dest}</span>
                    <span className="text-primary font-semibold">₹{flight.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
