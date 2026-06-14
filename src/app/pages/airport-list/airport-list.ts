import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { AirportResponseDTO } from '../../models/airport-response';
import { AirportService } from '../../services/airport-service';
import { AuthService } from '../../services/auth.service';

import { MatSortModule, Sort } from '@angular/material/sort';

import { MatTooltipModule } from '@angular/material/tooltip';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { delay } from 'rxjs/operators'; //testing purposes

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { AirportCreateForm } from '../airport-create-form/airport-create-form';

import { MatDialogModule } from '@angular/material/dialog';

import { AirportViewForm } from '../airport-view-form/airport-view-form';

import { AirportDeleteForm } from '../airport-delete-form/airport-delete-form';


@Component({
  selector: 'app-airport-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  templateUrl: './airport-list.html',
  styleUrl: './airport-list.css',
})
export class AirportList implements OnInit, OnDestroy {
  airports: AirportResponseDTO[] = [];
  filteredAirports: AirportResponseDTO[] = [];
  countries: string[] = [];
  pagedAirports: AirportResponseDTO[] = [];

  page = 0;
  size = 25;
  totalPages = 0;
  totalElements = 0;
  sort = 'name,asc';
  loading = false;

  pageSize = 10;
  pageIndex = 0;

  filterForm!: FormGroup;

  readonly displayedColumns = ['iata', 'icao', 'name', 'city', 'country', 'timezone','actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private airportService: AirportService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {}

  get isEmployee(): boolean {
    return this.authService.getUserRole() === 'EMPLOYEE';
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      country: [''],
      iata: [''],
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$),
    ).subscribe(() => this.applyFilters());

    this.loadAirports();
  }

  loadAirports(): void {
    this.loading = true;
    this.airportService.getAllAirports(0, 1000, this.sort)//.pipe(delay(3000))
    .subscribe({
      next: page => {
        this.airports = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.countries = [...new Set<string>(page.content.map((a: AirportResponseDTO) => a.country))].sort();
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        console.error('Error loading airports', err);
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const { search, country, iata } = this.filterForm.value;
    const term = (search ?? '').toLowerCase().trim();
    const iataVal = (iata ?? '').toLowerCase().trim();

    this.filteredAirports = this.airports.filter(a => {
      const matchesSearch = !term || [a.name, a.city, a.country]
        .some(f => f.toLowerCase().includes(term));
      const matchesCountry = !country || a.country === country;
      const matchesIata = !iataVal || a.iata.toLowerCase().startsWith(iataVal);
      return matchesSearch && matchesCountry && matchesIata;
    });

    this.pageIndex = 0;
    this.updatePage();

  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', country: '', iata: '' });
  }



  createPane(): void {
    const ref = this.dialog.open(AirportCreateForm, {
        data: { airport: null },
        width: '560px',
        autoFocus: false,
      });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.airportService.createAirport(result).subscribe({
        next: () => this.loadAirports(),
        error: err => console.error('Create failed', err),
      });
    });
  }

  openView(airport: AirportResponseDTO): void {
    this.dialog.open(AirportViewForm, {
      data: { airport },
      width: '500px',
      autoFocus: false,
      });
  }

  openEdit(airport: AirportResponseDTO): void {
   const ref = this.dialog.open(AirportCreateForm, {
     data: {airport },
     width: '560px',
     autoFocus: false,
     });

   ref.afterClosed().subscribe(result => {
     if (!result) return;
     this.airportService.updateAirport(airport.id, result).subscribe({
       next: () => this.loadAirports(),
       error: err => console.error('Create failed', err),
       });
     });
  }

  //   placeholder methods

  openDelete(airport: AirportResponseDTO): void {
    const ref = this.dialog.open(AirportDeleteForm, {
      data: { airport },
      width: '480px',
      autoFocus: false,
      });

    ref.afterClosed().subscribe((confirmed: boolean) => {
    if (!confirmed) return;

    this.airports = this.airports.filter( a => a.id !== airport.id);
    this.applyFilters();

    const totalAfter = this.filteredAirports.length;
    const lastPage = Math.max(0, Math.ceil(totalAfter / this.pageSize) - 1);
    if (this.pageIndex > lastPage) {
      this.pageIndex = lastPage;
      this.updatePage();
    }
    });
  }

  //   placeholder methods

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadAirports(); }
  }

  previousPage(): void {
    if (this.page > 0) { this.page--; this.loadAirports(); }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSortChange(sort: Sort):void {
    if (!sort.active || sort.direction === ''){
      this.applyFilters();
      return;
      }
    this.filteredAirports = [...this.filteredAirports].sort((a,b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      const valA = (a as any)[sort.active] ?? '';
          const valB = (b as any)[sort.active] ?? '';
          return valA.localeCompare(valB) * dir;
        });
   }

 onPageChange(event: PageEvent): void {
   this.pageSize = event.pageSize;
   this.pageIndex = event.pageIndex;
   this.updatePage()
   }

 updatePage(): void {
   const start = this.pageIndex * this.pageSize;
   this.pagedAirports = this.filteredAirports.slice(start, start + this.pageSize);

   }


}
