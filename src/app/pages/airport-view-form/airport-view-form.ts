import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AirportResponseDTO } from '../../models/airport-response';

export interface AirportViewFormData {
  airport: AirportResponseDTO;
}

@Component({
  selector: 'app-airport-view-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './airport-view-form.html',
  styleUrl: './airport-view-form.css',
})

export class AirportViewForm {
    constructor(
      private dialogRef: MatDialogRef<AirportViewForm>,

      @Inject(MAT_DIALOG_DATA) public data: AirportViewFormData
      ){}
    close(): void {
      this.dialogRef.close();
    }
}
