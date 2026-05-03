import { Component, OnInit } from '@angular/core';
import { FlightResponseDTO } from '../../models/flight-response';
import { FlightService } from '../../services/flight-service';
import { CommonModule } from '@angular/common';
import { FlightFilterDTO } from '../../models/flight-filter';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../services/route-service';
import { RouteResponseDTO } from '../../models/route-response';
import { PageResponse } from '../../models/airport-response';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlightCardComponent } from '../components/flight-card/flight-card';
import { FooterComponent } from '../components/footer/footer';


@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    FlightCardComponent,
    FooterComponent,
  ],
  templateUrl: './flight-list.html',
  styleUrl: './flight-list.css',
})
export class FlightList implements OnInit{
  flights: FlightResponseDTO[] = [];
  routes: RouteResponseDTO[] = [];

  page = 0;
  size = 5;
  totalPages = 0;
  sort = 'departureScheduled,asc';
  loading = false;

  filterForm!: FormGroup;

  filters: FlightFilterDTO = {
      dateFrom: undefined,
      dateTo: undefined,
      routeId: undefined,
      status: undefined,
      code: undefined,
      origin: undefined,
      destination: undefined,
      statuses: [],
      originId: undefined,
      destinationId: undefined
      }

  constructor(
      private flightService: FlightService,
      private routeService: RouteService,
      private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder
      ){}


  ngOnInit(): void {
    this.filterForm = this.fb.group({
      status: this.fb.control<string>(''),
      statuses: this.fb.control<string[]>([]),
      dateFrom: this.fb.control<string | null>(null),
      dateTo: this.fb.control<string | null>(null),
      origin: this.fb.control<string>(''),
      destination: this.fb.control<string>(''),
      code: this.fb.control<string>(''),
      routeId: this.fb.control<number | null>(null),
      originId: this.fb.control<number | null>(null),
      destinationId: this.fb.control<number | null>(null)
    });

    this.loadFlights();
  }

  private formatDate(date: Date): string {
      const y = date.getFullYear();
      const mo = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${mo}-${d}`;
    }

  private loadRoutes(): void {
      this.routeService.getAllRoutes().subscribe({ next: p => this.routes = p.content });
    }

  loadFlights(){
    this.loading = true;
    this.flightService.getAllFlights(this.page, this.size, this.sort, this.filters).subscribe({
      next: page => {
        this.flights = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
        console.log(this.flights);
        },
      error: err => {
        console.error('Error while loading the flights!', err);
        this.loading = false;
        }
      });
    }

  nextPage(){
      if (this.page<this.totalPages-1){
        this.page++;
        this.loadFlights();
        }
      }

  previousPage(){
    if (this.page>0){
      this.page--;
      this.loadFlights();
      }
    }

  sortTable(){
    this.sort = this.sort === 'departureScheduled,asc' ? 'departureScheduled,desc' : 'departureScheduled,asc';
    this.loadFlights();
    }

  applyFilters() {
    const raw = this.filterForm.value;

    this.filters = {
      statuses: raw.statuses ?? [],
      dateFrom: raw.dateFrom? `${raw.dateFrom}T00:00:00`: undefined,
      dateTo: raw.dateTo? `${raw.dateTo}T23:59:59`: undefined,
      origin: raw.origin || undefined,
      destination: raw.destination || undefined,
      code: raw.code || undefined,
      routeId: raw.routeId || undefined,
      status: raw.status || undefined
    };

    this.page = 0;
    this.loadFlights();
  }

  clearFilters() {
    this.filterForm.reset({
      statuses: [],
      dateFrom: '',
      dateTo: '',
      origin: '',
      destination: '',
      code: '',
      routeId: null
    });

    this.filters = {};
    this.page = 0;
    this.loadFlights();
  }



}
