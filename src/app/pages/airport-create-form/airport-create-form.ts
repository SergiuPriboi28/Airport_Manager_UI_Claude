import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AirportCreateDTO } from '../../models/airport-create';

export interface AirportCreateFormData {
  airport: AirportCreateDTO;
  }


@Component({
  selector: 'app-airport-create-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ],
  templateUrl: './airport-create-form.html',
  styleUrl: './airport-create-form.css',
})


export class AirportCreateForm {
    createForm: FormGroup;
    onEdit: boolean;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AirportCreateForm>,
      @Inject(MAT_DIALOG_DATA) public data: AirportCreateFormData
      ) {

        this.onEdit = !!data?.airport;

        this.createForm = this.fb.group({
              iata:     [data?.airport?.iata     ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
              icao:     [data?.airport?.icao     ?? '', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
              name:     [data?.airport?.name     ?? '', Validators.required],
              city:     [data?.airport?.city     ?? '', Validators.required],
              country:  [data?.airport?.country  ?? '', Validators.required],
              timezone: [data?.airport?.timezone ?? '', Validators.required],
            });
        }

    onIataInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const upper = input.value.toUpperCase();
        this.createForm.get('iata')!.setValue(upper, { emitEvent: false });
        input.value = upper;
      }

    onIcaoInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      const upper = input.value.toUpperCase();
      this.createForm.get('icao')!.setValue(upper, { emitEvent: false });
      input.value = upper;
    }

    submit(): void {
      this.createForm.markAllAsTouched();
      if (this.createForm.invalid) return;
      this.dialogRef.close(this.createForm.value);
    }

    cancel(): void {
      this.dialogRef.close();
    }

}
