import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { City, Flight, RouteResult } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Eye, EyeOff, Zap } from "lucide-react";

interface MapVisualizationProps {
  cities: City[];
  flights: Flight[];
  optimalRoute: RouteResult | null;
  showOptimalPath: boolean;
}

export function MapVisualization({
  cities,
  flights,
  optimalRoute,
  showOptimalPath,
}: MapVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate nodes from cities
  useEffect(() => {
    const newNodes: Node[] = cities.map((city, index) => {
      const angle = (index / cities.length) * 2 * Math.PI;
      const radius = 250;
      
      return {
        id: city.name,
        type: "default",
        position: {
          x: 400 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle),
        },
        data: {
          label: (
            <div className="flex flex-col items-center">
              <div className="font-bold text-sm">{city.name}</div>
            </div>
          ),
        },
        style: {
          background: "linear-gradient(135deg, hsl(207 90% 54%) 0%, hsl(217 91% 60%) 100%)",
          color: "white",
          border: "2px solid hsl(207 90% 54%)",
          borderRadius: "50%",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
          boxShadow: "0 4px 16px hsl(207 90% 54% / 0.3)",
          transition: "all 0.3s ease",
        },
      };
    });

    setNodes(newNodes);
  }, [cities, setNodes]);

  // Generate edges from flights
  useEffect(() => {
    const optimalPathSet = new Set(
      optimalRoute?.path.map(
        (f) => `${f.src}-${f.dest}`
      ) || []
    );

    const newEdges: Edge[] = flights.map((flight, index) => {
      const edgeId = `${flight.src}-${flight.dest}-${index}`;
      const isOptimal = showOptimalPath && optimalPathSet.has(`${flight.src}-${flight.dest}`);
      
      return {
        id: edgeId,
        source: flight.src,
        target: flight.dest,
        type: "smoothstep",
        animated: isOptimal,
        label: `${flight.airline} ${flight.flightNumber}\n₹${flight.cost}`,
        labelStyle: {
          fill: isOptimal ? "hsl(142 76% 36%)" : "hsl(222 47% 11%)",
          fontWeight: isOptimal ? "bold" : "normal",
          fontSize: "10px",
        },
        style: {
          stroke: isOptimal ? "hsl(142 76% 36%)" : "hsl(207 90% 54%)",
          strokeWidth: isOptimal ? 4 : 2,
          opacity: isOptimal ? 1 : 0.6,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isOptimal ? "hsl(142 76% 36%)" : "hsl(207 90% 54%)",
          width: 20,
          height: 20,
        },
      };
    });

    setEdges(newEdges);
  }, [flights, optimalRoute, showOptimalPath, setEdges]);

  // Animate new additions
  useEffect(() => {
    if (cities.length > 0 || flights.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cities.length, flights.length]);

  const handleResetLayout = useCallback(() => {
    const newNodes = nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = 250;
      
      return {
        ...node,
        position: {
          x: 400 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle),
        },
      };
    });
    
    setNodes(newNodes);
  }, [nodes, setNodes]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-large border-2 border-primary/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className={`bg-gradient-to-br from-sky-light/30 to-background ${
          isAnimating ? "animate-fade-in" : ""
        }`}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(207 90% 54% / 0.2)"
        />
        <Controls className="bg-card border border-border rounded-lg shadow-soft" />
        <MiniMap
          className="bg-card border border-border rounded-lg shadow-soft"
          maskColor="hsl(207 90% 54% / 0.1)"
          nodeColor={(node) => "hsl(207 90% 54%)"}
        />
      </ReactFlow>

      {/* Floating Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <Card className="p-3 shadow-medium bg-card/95 backdrop-blur">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Map Controls</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLayout}
              className="w-full"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Reset Layout
            </Button>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-3 shadow-medium bg-card/95 backdrop-blur">
          <div className="space-y-2">
            <div className="text-sm font-semibold mb-2">Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-sky"></div>
              <span className="text-xs">City Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-sky"></div>
              <span className="text-xs">Flight Route</span>
            </div>
            {showOptimalPath && optimalRoute && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-success"></div>
                <span className="text-xs font-semibold text-success">Optimal Path</span>
              </div>
            )}
          </div>
        </Card>

        {/* Stats */}
        {cities.length > 0 && (
          <Card className="p-3 shadow-medium bg-card/95 backdrop-blur">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Cities:</span>
                <Badge variant="secondary">{cities.length}</Badge>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Routes:</span>
                <Badge variant="secondary">{flights.length}</Badge>
              </div>
              {optimalRoute && showOptimalPath && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Hops:</span>
                  <Badge className="bg-success">{optimalRoute.path.length}</Badge>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Empty State */}
      {cities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-2 bg-card/80 backdrop-blur p-8 rounded-lg shadow-large">
            <Eye className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground font-medium">
              Add cities to see the network map
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
