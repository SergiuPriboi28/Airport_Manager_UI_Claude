import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AirportResponseDTO } from '../../models/airport-response';
import { AirportService } from '../../services/airport-service';

export interface AirportDeleteFormData {
  airport: AirportResponseDTO;
}

@Component({
  selector: 'app-airport-delete-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './airport-delete-form.html',
  styleUrl: './airport-delete-form.css',
})

export class AirportDeleteForm {
  loading = signal(false);
  apiError = signal<string | null>(null);

  constructor(
    private dialogRef: MatDialogRef<AirportDeleteForm>,
    private airportService: AirportService,
    @Inject(MAT_DIALOG_DATA) public data: AirportDeleteFormData,
    ){}

  cancel(): void {
    this.dialogRef.close(false);
    }

  confirm(): void {
      this.loading.set(true);
      this.apiError.set(null);

      this.airportService.deleteAirport(this.data.airport.id).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => {
          this.loading.set(false);
          this.apiError.set(err?.error?.message ?? err?.message ?? 'Delete failed. Please try again.');
        },
      });
    }
}
