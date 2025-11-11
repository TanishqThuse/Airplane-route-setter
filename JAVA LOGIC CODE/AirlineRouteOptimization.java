import java.util.*;

public class AirlineRouteOptimization {
    static class Flight {
        String airline, flightNumber;
        int src, dest, cost, duration; // duration in minutes
        String depTime, arrTime;
        boolean isTwoWay;

        Flight(String airline, String flightNumber, int src, int dest, int cost, int duration, String depTime, String arrTime, boolean isTwoWay) {
            this.airline = airline;
            this.flightNumber = flightNumber;
            this.src = src;
            this.dest = dest;
            this.cost = cost;
            this.duration = duration;
            this.depTime = depTime;
            this.arrTime = arrTime;
            this.isTwoWay = isTwoWay;
        }
    }

    static class Node implements Comparable<Node> {
        int city, cost, duration;
        List<Flight> path;

        Node(int city, int cost, int duration, List<Flight> path) {
            this.city = city;
            this.cost = cost;
            this.duration = duration;
            this.path = path;
        }

        public int compareTo(Node o) {
            return Integer.compare(this.cost, o.cost); // Change to duration for time optimization
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number of cities: ");
        int n = Integer.parseInt(sc.nextLine());
        String[] cityNames = new String[n];
        Map<String, Integer> cityIndex = new HashMap<>();
        System.out.println("Enter city names:");
        for (int i = 0; i < n; i++) {
            cityNames[i] = sc.nextLine();
            cityIndex.put(cityNames[i], i);
        }

        System.out.print("Enter number of flights: ");
        int m = Integer.parseInt(sc.nextLine());
        List<List<Flight>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

        System.out.println("Enter flight details (airline flightNumber srcCity destCity cost duration depTime arrTime twoWay[Y/N]):");
        for (int i = 0; i < m; i++) {
            String[] parts = sc.nextLine().split(" ");
            String airline = parts[0], flightNumber = parts[1];
            int src = cityIndex.get(parts[2]);
            int dest = cityIndex.get(parts[3]);
            int cost = Integer.parseInt(parts[4]);
            int duration = Integer.parseInt(parts[5]);
            String depTime = parts[6], arrTime = parts[7];
            boolean isTwoWay = parts[8].equalsIgnoreCase("Y");
            Flight f = new Flight(airline, flightNumber, src, dest, cost, duration, depTime, arrTime, isTwoWay);
            adj.get(src).add(f);
            if (isTwoWay) {
                // Add reverse flight
                Flight rev = new Flight(airline, flightNumber, dest, src, cost, duration, arrTime, depTime, isTwoWay);
                adj.get(dest).add(rev);
            }
        }

        System.out.print("Enter source city: ");
        int srcCity = cityIndex.get(sc.nextLine());
        System.out.print("Enter destination city: ");
        int destCity = cityIndex.get(sc.nextLine());

        // Dijkstra's algorithm (by cost)
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[srcCity] = 0;
        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(srcCity, 0, 0, new ArrayList<>()));
        boolean[] visited = new boolean[n];
        Node result = null;

        while (!pq.isEmpty()) {
            Node curr = pq.poll();
            if (visited[curr.city]) continue;
            visited[curr.city] = true;
            if (curr.city == destCity) {
                result = curr;
                break;
            }
            for (Flight f : adj.get(curr.city)) {
                if (!visited[f.dest] && dist[curr.city] + f.cost < dist[f.dest]) {
                    dist[f.dest] = dist[curr.city] + f.cost;
                    List<Flight> newPath = new ArrayList<>(curr.path);
                    newPath.add(f);
                    pq.add(new Node(f.dest, dist[f.dest], curr.duration + f.duration, newPath));
                }
            }
        }

        if (result == null) {
            System.out.println("No path exists from " + cityNames[srcCity] + " to " + cityNames[destCity]);
        } else {
            System.out.println("Minimum cost from " + cityNames[srcCity] + " to " + cityNames[destCity] + ": " + result.cost);
            System.out.println("Total duration: " + result.duration + " minutes");
            System.out.println("Flight path:");
            for (Flight f : result.path) {
                System.out.println("  " + cityNames[f.src] + " -> " + cityNames[f.dest] +
                        " | " + f.airline + " " + f.flightNumber +
                        " | Cost: " + f.cost +
                        " | Duration: " + f.duration + " min" +
                        " | Dep: " + f.depTime + " Arr: " + f.arrTime);
            }
        }
    }
}


/**Ex-1 : Delhi to Kolkata
 * 
 * 4
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
Kolkata

Example 2 : Germany to Japan

5
Berlin
Frankfurt
Dubai
Tokyo
Osaka
6
Lufthansa LH123 Berlin Frankfurt 200 90 08:00 09:30 Y
Emirates EK204 Frankfurt Dubai 500 360 11:00 17:00 Y
ANA NH210 Dubai Tokyo 700 540 19:00 04:00 Y
JAL JL300 Tokyo Osaka 100 60 06:00 07:00 Y
Lufthansa LH456 Frankfurt Tokyo 900 720 10:00 22:00 N
ANA NH220 Dubai Osaka 800 600 20:00 06:00 N
Berlin
Osaka

Example 3 : Pune to New York

5
Pune
Mumbai
London
NewYork
Dubai
6
AirIndia AI850 Pune Mumbai 100 60 06:00 07:00 Y
BritishAirways BA198 Mumbai London 600 540 09:00 18:00 Y
Delta DL401 London NewYork 700 480 20:00 04:00 Y
Emirates EK501 Mumbai Dubai 400 180 08:00 11:00 Y
Emirates EK201 Dubai NewYork 900 840 13:00 03:00 N
AirIndia AI101 Mumbai NewYork 1200 900 10:00 01:00 N
Pune
NewYork

Example 4 : Nashik to London

4
Nashik
Mumbai
Dubai
London
5
IndiGo 6E123 Nashik Mumbai 80 60 07:00 08:00 Y
Emirates EK501 Mumbai Dubai 400 180 10:00 13:00 Y
BritishAirways BA108 Dubai London 700 480 15:00 23:00 N
AirIndia AI131 Mumbai London 900 600 09:00 19:00 N
Emirates EK502 London Dubai 700 480 01:00 09:00 N
Nashik
London

✈️ Example 5: Bengaluru to San Francisco
6
Bengaluru
Delhi
Dubai
London
NewYork
SanFrancisco
7
AirIndia AI504 Bengaluru Delhi 150 120 06:00 08:00 Y
Emirates EK507 Bengaluru Dubai 350 240 09:00 13:00 Y
BritishAirways BA112 London NewYork 400 480 16:00 00:00 Y
United UA890 NewYork SanFrancisco 250 360 08:00 14:00 Y
AirIndia AI173 Delhi SanFrancisco 700 900 10:00 01:00 N
Emirates EK201 Dubai NewYork 600 780 14:00 03:00 N
BritishAirways BA118 Dubai London 500 420 15:00 22:00 N
Bengaluru
SanFrancisco


Scenario: Tests transcontinental optimization — multiple long-haul alternatives via Europe or direct India-US route.

🌍 Example 6: Paris to Sydney
5
Paris
Dubai
Singapore
Sydney
Melbourne
6
Emirates EK074 Paris Dubai 550 360 08:00 15:00 Y
SingaporeAir SQ231 Singapore Sydney 450 420 17:00 00:00 Y
Emirates EK416 Dubai Sydney 700 840 18:00 08:00 Y
Qantas QF402 Sydney Melbourne 120 90 09:00 10:30 N
AirFrance AF234 Paris Singapore 600 780 10:00 23:00 N
Emirates EK218 Paris Melbourne 750 960 12:00 04:00 N
Paris
Sydney


Scenario: Evaluates east–west multi-hop routing and flight duration–cost trade-offs.

🇮🇳 Example 7: Ahmedabad to Guwahati
5
Ahmedabad
Delhi
Kolkata
Patna
Guwahati
6
IndiGo 6E145 Ahmedabad Delhi 120 90 07:00 08:30 Y
Vistara UK753 Delhi Kolkata 180 150 10:00 12:30 Y
SpiceJet SG912 Kolkata Guwahati 100 60 14:00 15:00 Y
GoAir G837 Delhi Guwahati 250 150 11:00 13:30 N
AirIndia AI701 Delhi Patna 150 120 09:00 11:00 N
IndiGo 6E566 Patna Guwahati 100 60 12:30 13:30 N
Ahmedabad
Guwahati


Scenario: Domestic multi-hop with competitive regional alternatives — ideal to test dense graph routing.

🌐 Example 8: Tokyo to Cape Town
6
Tokyo
Singapore
Dubai
Nairobi
Johannesburg
CapeTown
7
ANA NH843 Tokyo Singapore 400 420 08:00 15:00 Y
Emirates EK353 Singapore Dubai 350 360 16:30 22:30 Y
Emirates EK763 Dubai Johannesburg 500 480 00:00 08:00 Y
SouthAfrican SA357 Johannesburg CapeTown 120 120 09:30 11:30 Y
Qatar QR813 Tokyo Doha 550 540 09:00 17:00 N
Qatar QR1369 Doha CapeTown 650 840 18:30 08:30 N
SingaporeAir SQ482 Singapore Johannesburg 600 600 17:00 03:00 N
Tokyo
CapeTown


Scenario: Multi-continent travel showing algorithm robustness across Asia–Africa pathfinding.

🏔️ Example 9: Zurich to Oslo
4
Zurich
Amsterdam
Copenhagen
Oslo
5
KLM KL1954 Zurich Amsterdam 150 120 07:00 09:00 Y
SAS SK541 Amsterdam Copenhagen 120 90 10:00 11:30 Y
Norwegian DY747 Copenhagen Oslo 80 60 12:30 13:30 Y
Swiss LX121 Zurich Copenhagen 220 150 08:00 10:30 N
KLM KL1192 Zurich Oslo 300 210 07:30 11:00 N
Zurich
Oslo

Scenario: Compact European routing — good for small test graph verification.

🏝️ Example 10: Mumbai to Bali
5
Mumbai
Singapore
KualaLumpur
Jakarta
Bali
6
AirIndia AI342 Mumbai Singapore 250 330 06:00 11:30 Y
AirAsia AK101 Singapore KualaLumpur 120 60 13:00 14:00 Y
Garuda GA243 KualaLumpur Jakarta 150 120 15:00 17:00 Y
LionAir JT307 Jakarta Bali 100 90 18:00 19:30 Y
SingaporeAir SQ410 Mumbai Singapore 300 360 07:00 13:00 N
Garuda GA415 Singapore Bali 400 420 14:00 21:00 N
Mumbai
Bali



// BUS STOPSSS 
/** 🚌 Example 1 : Swargate to Viman Nagar
 * 
 * 5
Swargate
Katraj
Shivajinagar
KalyaniNagar
VimanNagar
6
PMPML 129 Swargate Katraj 20 15 07:00 07:15 Y
PMPML 234 Katraj Shivajinagar 25 30 07:20 07:50 Y
PMPML 145 Shivajinagar KalyaniNagar 20 25 08:00 08:25 Y
PMPML 156 KalyaniNagar VimanNagar 15 10 08:30 08:40 Y
PMPML 178 Swargate Shivajinagar 35 35 07:10 07:45 N
PMPML 301 Shivajinagar VimanNagar 25 20 08:00 08:20 N
Swargate
VimanNagar

Scenario : Basic in-city optimization showing multiple possible routes via Swargate hub and Shivajinagar.
-----------------------------------------------------------------------

🚌 Example 2 : Kothrud Depot to Hadapsar Industrial Area
 *
 * 6
KothrudDepot
Deccan
Swargate
Camp
Magarpatta
Hadapsar
7
PMPML 201 KothrudDepot Deccan 15 10 06:30 06:40 Y
PMPML 214 Deccan Swargate 10 10 06:45 06:55 Y
PMPML 302 Swargate Camp 20 15 07:00 07:15 Y
PMPML 325 Camp Magarpatta 25 20 07:20 07:40 Y
PMPML 341 Magarpatta Hadapsar 10 10 07:45 07:55 Y
PMPML 251 Swargate Hadapsar 30 25 07:00 07:25 N
PMPML 270 Deccan Hadapsar 40 35 06:50 07:25 N
KothrudDepot
Hadapsar

Scenario : Tests multi-hop west-to-east travel through central Pune corridor.
-----------------------------------------------------------------------

🚌 Example 3 : Nigdi to Kharadi Bypass
 *
 * 6
Nigdi
Akurdi
Pimpri
Shivajinagar
Yerwada
Kharadi
7
PMPML 305 Nigdi Akurdi 10 8 06:00 06:08 Y
PMPML 312 Akurdi Pimpri 10 7 06:10 06:17 Y
PMPML 330 Pimpri Shivajinagar 25 25 06:30 06:55 Y
PMPML 345 Shivajinagar Yerwada 20 20 07:00 07:20 Y
PMPML 356 Yerwada Kharadi 15 15 07:25 07:40 Y
PMPML 318 Pimpri Yerwada 30 25 06:35 07:00 N
PMPML 327 Akurdi Kharadi 40 40 06:10 06:50 N
Nigdi
Kharadi

Scenario : Tests north-east transit optimization across industrial and IT zones.
-----------------------------------------------------------------------

🚌 Example 4 : Baner to Katraj via City Center
 *
 * 5
Baner
Aundh
Shivajinagar
Swargate
Katraj
6
PMPML 401 Baner Aundh 10 8 07:00 07:08 Y
PMPML 412 Aundh Shivajinagar 15 15 07:10 07:25 Y
PMPML 422 Shivajinagar Swargate 20 20 07:30 07:50 Y
PMPML 433 Swargate Katraj 10 10 07:55 08:05 Y
PMPML 435 Baner Swargate 35 30 07:05 07:35 N
PMPML 438 Aundh Katraj 40 40 07:10 07:50 N
Baner
Katraj

Scenario : South-bound multi-transfer urban routing through core city.
-----------------------------------------------------------------------

🚌 Example 5 : Vishrantwadi to Sinhagad College
 *
 * 6
Vishrantwadi
Yerwada
KoregaonPark
Swargate
Dhankawadi
SinhagadCollege
7
PMPML 501 Vishrantwadi Yerwada 10 8 07:00 07:08 Y
PMPML 515 Yerwada KoregaonPark 10 7 07:10 07:17 Y
PMPML 530 KoregaonPark Swargate 20 20 07:25 07:45 Y
PMPML 542 Swargate Dhankawadi 15 10 07:50 08:00 Y
PMPML 550 Dhankawadi SinhagadCollege 10 10 08:05 08:15 Y
PMPML 560 Vishrantwadi Swargate 30 25 07:05 07:30 N
PMPML 575 Yerwada SinhagadCollege 45 40 07:15 07:55 N
Vishrantwadi
SinhagadCollege

Scenario : Tests north-south long route with campus destination optimization.
-----------------------------------------------------------------------

🚌 Example 6 : Pune Station to Warje Malwadi
 *
 * 5
PuneStation
Deccan
Kothrud
Warje
WarjeMalwadi
6
PMPML 610 PuneStation Deccan 15 10 06:30 06:40 Y
PMPML 625 Deccan Kothrud 10 10 06:45 06:55 Y
PMPML 635 Kothrud Warje 15 15 07:00 07:15 Y
PMPML 640 Warje WarjeMalwadi 10 8 07:20 07:28 Y
PMPML 655 Deccan Warje 25 20 06:50 07:10 N
PMPML 670 PuneStation Warje 35 30 06:35 07:05 N
PuneStation
WarjeMalwadi

Scenario : West-bound travel from railway hub to suburban terminus with transfer optimization.
-----------------------------------------------------------------------

*/


// railways 
/** 🚆 Example 1 : Pune to Delhi
 * 
 * 5
Pune
Manmad
Bhopal
Agra
Delhi
6
IndianRailways 12149 Pune Manmad 250 180 06:00 09:00 Y
IndianRailways 12150 Manmad Bhopal 400 360 09:30 15:30 Y
IndianRailways 12151 Bhopal Agra 350 300 16:00 21:00 Y
IndianRailways 12152 Agra Delhi 200 120 21:30 23:30 Y
IndianRailways 12952 Pune Bhopal 600 480 07:00 15:00 N
IndianRailways 12627 Manmad Delhi 700 600 09:00 19:00 N
Pune
Delhi

Scenario : Cross-country central route optimization using major express lines.
-----------------------------------------------------------------------

🚆 Example 2 : Mumbai to Chennai
 *
 * 5
Mumbai
Pune
Solapur
Guntakal
Chennai
6
IndianRailways 11041 Mumbai Pune 150 180 05:30 08:30 Y
IndianRailways 11042 Pune Solapur 200 180 09:00 12:00 Y
IndianRailways 12702 Solapur Guntakal 250 240 12:30 16:30 Y
IndianRailways 12658 Guntakal Chennai 300 300 17:00 22:00 Y
IndianRailways 12163 Mumbai Solapur 400 360 06:00 12:00 N
IndianRailways 12630 Pune Chennai 600 540 08:00 17:00 N
Mumbai
Chennai

Scenario : South-bound route optimization via Maharashtra and Andhra junctions.
-----------------------------------------------------------------------

🚆 Example 3 : Bengaluru to Hyderabad
 *
 * 4
Bengaluru
Dharmavaram
Kurnool
Hyderabad
5
IndianRailways 12786 Bengaluru Dharmavaram 150 150 06:00 08:30 Y
IndianRailways 17604 Dharmavaram Kurnool 180 180 09:00 12:00 Y
IndianRailways 12793 Kurnool Hyderabad 200 150 12:30 15:00 Y
IndianRailways 12797 Bengaluru Kurnool 300 270 07:00 11:30 N
IndianRailways 12799 Bengaluru Hyderabad 400 360 06:30 12:30 N
Bengaluru
Hyderabad

Scenario : South Indian regional rail optimization between metro hubs.
-----------------------------------------------------------------------

🚆 Example 4 : Ahmedabad to Kolkata
 *
 * 6
Ahmedabad
Vadodara
Bhopal
Prayagraj
Patna
Kolkata
7
IndianRailways 12905 Ahmedabad Vadodara 100 90 06:00 07:30 Y
IndianRailways 12953 Vadodara Bhopal 250 240 08:00 12:00 Y
IndianRailways 12192 Bhopal Prayagraj 300 300 12:30 17:30 Y
IndianRailways 12308 Prayagraj Patna 200 180 18:00 21:00 Y
IndianRailways 12302 Patna Kolkata 250 240 21:30 01:30 Y
IndianRailways 12941 Ahmedabad Patna 600 600 07:00 17:00 N
IndianRailways 12306 Vadodara Kolkata 700 660 09:00 20:00 N
Ahmedabad
Kolkata

Scenario : Western to eastern rail corridor with multiple transits.
-----------------------------------------------------------------------

🚆 Example 5 : Delhi to Amritsar
 *
 * 4
Delhi
Panipat
Ludhiana
Amritsar
5
IndianRailways 12013 Delhi Panipat 100 90 07:00 08:30 Y
IndianRailways 12014 Panipat Ludhiana 150 150 09:00 11:30 Y
IndianRailways 12015 Ludhiana Amritsar 120 120 12:00 14:00 Y
IndianRailways 12459 Delhi Ludhiana 200 180 07:00 10:00 N
IndianRailways 12031 Delhi Amritsar 300 300 06:30 11:30 N
Delhi
Amritsar

Scenario : Short northern intercity corridor with frequent express alternatives.
-----------------------------------------------------------------------
*/
