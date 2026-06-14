import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { FlightResponseDTO } from '../../models/flight-response';
import { BookingService } from '../../services/booking-service';
import { BookingResponseDTO } from '../../models/booking-response';
import { AircraftResponseDTO } from '../../models/aircraft-response';
import { AircraftService } from '../../services/aircraft.service';
import { FlightService } from '../../services/flight-service';
import { FlightDetailResponseDTO, PassengerInfoDTO } from '../../models/flight-detail-response';

export interface FlightDetailDialogData {
  flight: FlightResponseDTO;
}

@Component({
  selector: 'app-flight-detail-pane',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './flight-detail-pane.html',
  styleUrl: './flight-detail-pane.css',
})
export class FlightDetailPane implements OnInit {
  flight: FlightResponseDTO;
  bookings: BookingResponseDTO[] = [];
  aircraft: AircraftResponseDTO | null = null;
  loading = false;
  loadingAc = false;
  bookingsError: string | null = null;
  aircraftError: string | null = null;
  detail: FlightDetailResponseDTO | null = null;
  passengers: PassengerInfoDTO[] = [];


  readonly statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    SCHEDULED: { label: 'Scheduled', color: '#1565c0', bg: '#e3f2fd', icon: 'schedule'                    },
    BOARDING:  { label: 'Boarding',  color: '#e65100', bg: '#fff3e0', icon: 'airline_seat_recline_normal' },
    DELAYED:   { label: 'Delayed',   color: '#bf360c', bg: '#fbe9e7', icon: 'running_with_errors'         },
    CANCELLED: { label: 'Cancelled', color: '#b71c1c', bg: '#ffebee', icon: 'cancel'                     },
    IN_AIR:    { label: 'In Air',    color: '#1b5e20', bg: '#e8f5e9', icon: 'flight'                     },
    LANDED:    { label: 'Landed',    color: '#424242', bg: '#f5f5f5', icon: 'flight_land'                },
  };

  readonly bookingStatusConfig: Record<string, { color: string; bg: string }> = {
    CONFIRMED:  { color: '#1b5e20', bg: '#e8f5e9' },
    CANCELLED:  { color: '#b71c1c', bg: '#ffebee' },
    CHECKED_IN: { color: '#1565c0', bg: '#e3f2fd' },
  };

  readonly bookingColumns = ['passenger', 'pnr', 'status'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FlightDetailDialogData,
    private dialogRef: MatDialogRef<FlightDetailPane>,
    private bookingService: BookingService,
    private aircraftService: AircraftService,
    private flightService: FlightService,
  ) {
    this.flight = data.flight;
  }


ngOnInit(): void {
  this.loadDetail();
  this.loadAircraft()
}

private loadAircraft(): void {
  this.loadingAc = true;
  this.aircraftService.getById(this.flight.id).subscribe({
    next: (detail: AircraftResponseDTO) => {
      this.aircraft = detail;
      this.loadingAc = false;
      },
    error: (err: unknown) => {
      console.error('No aircraft model defined', err);
      this.aircraftError = 'No aircraft model defined';
      this.loadingAc = false;
      }
    })
  }

private loadDetail(): void {
  this.loading = true;
  this.flightService.getFlightDetail(this.flight.id).subscribe({
    next: (detail: FlightDetailResponseDTO) => {
      this.detail = detail;
      this.passengers = detail.passengers;
      this.loading = false;
    },
    error: (err: unknown) => {
      console.error('Could not load flight detail', err);
      this.bookingsError = 'Could not load flight details.';
      this.loading = false;
    }
  });
}

  durationLabel(): string {
    const dep = new Date(this.flight.departureTime);
    const arr = new Date(this.flight.arrivalTime);
    const diffMs = arr.getTime() - dep.getTime();
    if (diffMs <= 0) return '—';
    const totalMinutes = Math.floor(diffMs / 60_000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  onEditFlight(): void {
    this.dialogRef.close({ action: 'edit', flight: this.flight });
  }

  onUpdateStatus(): void {
    this.dialogRef.close({ action: 'updateStatus', flight: this.flight });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
