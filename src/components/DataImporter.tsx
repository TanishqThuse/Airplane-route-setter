// /components/DataImporter.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { parseFlightData } from "@/utils/dataParser";
import { City, Flight } from "@/types/flight";

interface DataImporterProps {
  onImport: (cities: City[], flights: Flight[]) => void;
}

export function DataImporter({ onImport }: DataImporterProps) {
  const [rawData, setRawData] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImport = () => {
    const { cities, flights } = parseFlightData(rawData);

    if (cities.length === 0 && flights.length === 0) {
      toast.error("Parsing failed. Please check the format.");
      return;
    }

    onImport(cities, flights);
    toast.success(`Imported ${cities.length} cities and ${flights.length} flights!`);
    setIsExpanded(false);
  };
  
  const exampleData = `4
Delhi
Mumbai
Chennai
Kolkata
5
AirIndia AI101 Delhi Mumbai 5000 120 08:00 10:00 Y
IndiGo 6E202 Mumbai Chennai 4000 150 11:00 13:30 N
SpiceJet SG303 Chennai Kolkata 3500 180 14:00 17:00 Y
AirAsia I505 Kolkata Delhi 3000 150 18:00 20:30 N
Vistara UK404 Delhi Chennai 6000 180 09:00 12:00 N
Delhi
Kolkata`;

  if (!isExpanded) {
    return (
      <Button 
        onClick={() => setIsExpanded(true)} 
        className="bg-gradient-sunset shadow-medium hover:shadow-large transition-smooth"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Data (Paste Raw Text)
      </Button>
    );
  }

  return (
    <Card className="shadow-soft w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange">
          <Upload className="w-5 h-5" />
          Import Raw Data
        </CardTitle>
        <CardDescription>
          Paste your network data using the format below (N cities, M flights).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your flight network data here..."
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          rows={10}
          className="font-mono text-xs"
        />
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleImport} 
            className="bg-gradient-sunset" 
            disabled={rawData.trim().length === 0}
          >
            <Upload className="w-4 h-4 mr-2" />
            Process & Import
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </Button>
        </div>
        
        <div className="p-3 bg-muted rounded-lg space-y-2 text-left">
            <p className="font-semibold text-sm">Expected Format Example:</p>
            <pre className="text-xs whitespace-pre-wrap p-2 bg-background rounded border border-border">
                {exampleData.split('\n').slice(0, 7).join('\n') + "\n..."}
            </pre>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-orange" />
                Note: The source/destination city lines at the very end of your block are ignored.
            </div>
        </div>
      </CardContent>
    </Card>
  );
}