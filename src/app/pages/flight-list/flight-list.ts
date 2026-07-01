import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlightResponseDTO } from '../../models/flight-response';
import { FlightService } from '../../services/flight-service';
import { CommonModule } from '@angular/common';
import { FlightFilterDTO } from '../../models/flight-filter';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../services/route-service';
import { RouteResponseDTO } from '../../models/route-response';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlightCardComponent } from '../components/flight-card/flight-card';
import { FooterComponent } from '../components/footer/footer';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { FlightDetailPane, FlightDetailDialogData } from '../flight-detail-pane/flight-detail-pane';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    FlightCardComponent,
    FooterComponent,
  ],
  templateUrl: './flight-list.html',
  styleUrl: './flight-list.css',
})
export class FlightList implements OnInit, OnDestroy {
  flights: FlightResponseDTO[] = [];
  routes: RouteResponseDTO[] = [];

  // Server-side pagination state
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sort = 'departureScheduled,asc';
  loading = false;

  readonly pageSizeOptions = [10, 25, 50];

  private destroy$ = new Subject<void>();

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
    destinationId: undefined,
    gate: undefined,
  };

  readonly statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    SCHEDULED: { label: 'Scheduled', color: '#1565c0', bg: '#e3f2fd', icon: 'schedule' },
    BOARDING: { label: 'Boarding', color: '#e65100', bg: '#fff3e0', icon: 'airline_seat_recline_normal' },
    DELAYED: { label: 'Delayed', color: '#bf360c', bg: '#fbe9e7', icon: 'running_with_errors' },
    CANCELLED: { label: 'Cancelled', color: '#b71c1c', bg: '#ffebee', icon: 'cancel' },
    IN_AIR: { label: 'In Air', color: '#1b5e20', bg: '#e8f5e9', icon: 'flight' },
    LANDED: { label: 'Landed', color: '#424242', bg: '#f5f5f5', icon: 'flight_land' },
  };

  readonly displayedColumns = [
    'code', 'route', 'departure', 'arrival', 'duration', 'gate', 'status', 'actions',
  ];

  constructor(
    private flightService: FlightService,
    private routeService: RouteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

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
      destinationId: this.fb.control<number | null>(null),
      gate: this.fb.control<string>(''),
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.page = 0;
      this.applyFilters();
    });

    this.loadRoutes();
    this.loadFlights();
  }

  private loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe({ next: p => this.routes = p.content });
  }

  loadFlights(): void {
    this.loading = true;
    this.flightService.getAllFlights(this.page, this.size, this.sort, this.filters).subscribe({
      next: page => {
        console.log('Flights page response:', page); // TEMP: inspect shape, then remove
        this.flights = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: err => {
        console.error('Error while loading the flights!', err);
        this.loading = false;
      },
    });
  }

  /** Triggered by mat-paginator (page index and/or page size changed). */
  onPageChange(event: PageEvent): void {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadFlights();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadFlights();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadFlights();
    }
  }

  sortTable(): void {
    this.sort = this.sort === 'departureScheduled,asc' ? 'departureScheduled,desc' : 'departureScheduled,asc';
    this.loadFlights();
  }

  applyFilters(): void {
    const raw = this.filterForm.value;

    this.filters = {
      statuses: raw.statuses ?? [],
      dateFrom: raw.dateFrom ? `${this.formatDate(new Date(raw.dateFrom))}T00:00:00` : undefined,
      dateTo: raw.dateTo ? `${this.formatDate(new Date(raw.dateTo))}T23:59:59` : undefined,
      origin: raw.origin || undefined,
      destination: raw.destination || undefined,
      code: raw.code || undefined,
      routeId: raw.routeId || undefined,
      status: raw.status || undefined,
    };

    this.page = 0;
    this.loadFlights();
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${mo}-${d}`;
  }

  clearFilters(): void {
    this.filterForm.reset({
      statuses: [],
      dateFrom: '',
      dateTo: '',
      origin: '',
      destination: '',
      code: '',
      routeId: null,
      status: null,
      gate: '',
    });

    this.filters = {};
    this.page = 0;
    this.loadFlights();
  }

  durationLabel(flight: FlightResponseDTO): string {
    const dep = new Date(flight.departureTime);
    const arr = new Date(flight.arrivalTime);
    const diffMs = arr.getTime() - dep.getTime();
    if (diffMs <= 0) return '—';
    const totalMinutes = Math.floor(diffMs / 60_000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  editFlight(flight: FlightResponseDTO): void {
    // TODO: open edit dialog
    console.log('Edit', flight);
  }

  deleteFlight(flight: FlightResponseDTO): void {
    // TODO: confirm and call flightService.deleteFlight(flight.id)
    console.log('Delete', flight);
  }

  openRow(flight: FlightResponseDTO): void {
    this.dialog.open(FlightDetailPane, {
      data: { flight } satisfies FlightDetailDialogData,
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
