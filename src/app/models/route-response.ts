export interface RouteResponseDTO {
  id: number;
  originAirportId: number;
  destAirportId: number;
  distanceNm: number;
  stdDurationMin: number;
  routeId: number;
  origin: string;
  destination: string;
}
