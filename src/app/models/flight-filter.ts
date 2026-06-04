export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';


export interface FlightFilterDTO{
  dateFrom?: string;
  dateTo?: string;
  routeId?: number;
  status?: FlightStatus;
  code?: string;
  origin?: string;
  destination?: string;
  statuses?: string[];
  originId?: number;
  destinationId?: number;
  gate?: string;

}
