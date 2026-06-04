export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

export interface PassengerInfoDTO {
  userId: string;
  email: string;
  docType: string;
  docNumber: string;
  nationality: string;
  pnr: string;
  bookingStatus: string;
}

export interface FlightDetailResponseDTO {
  id: number;
  code: string;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  gate: string;
  passengers: PassengerInfoDTO[];
}
