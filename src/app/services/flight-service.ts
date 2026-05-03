import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlightCreateDTO } from '../models/flight-create';
import { FlightResponseDTO, PageResponse } from '../models/flight-response';
import { FlightUpdateDTO } from '../models/flight-update';
import {Observable} from 'rxjs';
import { FlightFilterDTO } from "../models/flight-filter";

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  constructor(private http: HttpClient){}

  private url = `http://localhost:8080/api/flights`;
  private url_routes = `http://localhost:8080/api/routes`;

  getFlightById(id: number): Observable<FlightResponseDTO> {
    return this.http.get<FlightResponseDTO>(`${this.url}/${id}`);
    }

  getAllFlights(page: number = 0,
                       size: number = 10,
                       sort: string,
                       filters: FlightFilterDTO
                       ): Observable<any>{
      let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

      if (filters.dateFrom) {
        params = params.set("dateFrom", filters.dateFrom)}
      if (filters.dateTo) {
        params = params.set("dateTo", filters.dateTo)
        }
      if (filters.routeId) {
        params = params.set('routeId', filters.routeId)
      }
      if (filters.status) {
        params = params.set('status', filters.status)
        }
      if (filters.code) {
        params = params.set('code', filters.code);
      }
      if (filters.origin) {
        params = params.set('origin', filters.origin);
      }
      if (filters.destination) {
        params = params.set('destination', filters.destination);
      }
      filters.statuses?.forEach((status: string) => {
        params = params.append('statuses', status);
      });
//       return this.http.get<any>(this.url, { params });
      return this.http.get<PageResponse<FlightResponseDTO>>(this.url, { params });
      }

  searchFlights(query: {
    routeId?: number;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Observable<PageResponse<FlightResponseDTO>> {
    let params = new HttpParams();
    if (query.routeId  != null) params = params.set('routeId',  query.routeId.toString());
    if (query.dateFrom)         params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo)           params = params.set('dateTo',   query.dateTo);
    if (query.status)           params = params.set('status',   query.status);
    params = params.set('page', (query.page ?? 0).toString());
    params = params.set('size', (query.size ?? 20).toString());
    return this.http.get<PageResponse<FlightResponseDTO>>(this.url, { params });
  }

  createFlight(payload: FlightCreateDTO): Observable<FlightResponseDTO>{
      return this.http.post<FlightResponseDTO>(this.url, payload);
      }

  updateFlight(id: number, payload: FlightUpdateDTO): Observable<FlightResponseDTO>{
      return this.http.put<FlightResponseDTO>(`${this.url}/${id}`, payload);
      }

  deleteFlight(id: number): Observable<void>{
      return this.http.delete<void>(`${this.url}/${id}`);
    }

//    getRoutes(): Observable<any[]> {
//       return this.http.get<any[]>(this.url_routes);
//    }


}
