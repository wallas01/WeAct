import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ConflictsService,
  GroupedAcledEvents,
} from '../../../core/services/conflicts.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AcledEvent } from '../../../shared/interfaces/acled.interface';
// Moduli Angular Material
import { MatCardModule } from '@angular/material/card'; // Potrebbe non servire più con la tabella
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list'; // Potrebbe non servire più con la tabella
import { MatExpansionModule } from '@angular/material/expansion'; // Potrebbe non servire più con la tabella
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // NUOVO: per la tabella
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Opzionale: per la paginazione della tabella
import { MatSort, MatSortModule } from '@angular/material/sort'; // Opzionale: per l'ordinamento della tabella

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Necessario per ngModel o FormControl
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-conflitti',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatExpansionModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
  ],
  templateUrl: './conflitti.component.html',
  styleUrl: './conflitti.component.css',
  animations: [
    // Definizione dell'animazione per l'espansione della riga
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', padding: '0', border: '0' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ConflittiComponent implements OnInit {
  // Dati grezzi ricevuti dal backend, raggruppati per regione
  private allGroupedEvents: GroupedAcledEvents | null = null;
  loading: boolean = true;
  error: boolean = false;

  // Variabili per i filtri selezionati
  selectedRegion: string | null = null;
  selectedCountry: string | null = null;
  selectedCity: string | null = null;

  // Liste di opzioni per i dropdown
  uniqueRegions: string[] = [];
  uniqueCountriesForSelectedRegion: string[] = [];
  uniqueCitiesForSelectedCountry: string[] = [];

  // Dati filtrati per la Mat-Table
  dataSource = new MatTableDataSource<AcledEvent>([]);
  displayedColumns: string[] = [
    'event_date',
    'location',
    'country',
    'event_type',
    'fatalities',
    'notes', // Manteniamo la colonna notes ma mostreremo solo un'anteprima
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns]; // Colonne visibili, escluse quelle per i dettagli

  // Proprietà per tenere traccia della riga espansa
  expandedElement: AcledEvent | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private conflictService: ConflictsService) {}

  ngOnInit(): void {
    this.conflictService
      .getConflitti()
      .pipe(
        tap(() => (this.loading = true)), // Imposta loading a true prima della chiamata
        map((data) => {
          this.loading = false;
          this.error = false;
          this.allGroupedEvents = data; // Salva i dati grezzi
          if (data) {
            this.uniqueRegions = Object.keys(data).sort(); // Estrai e ordina le regioni
          }
          return data; // Passa i dati al prossimo operatore se necessario
        }),
        catchError((err) => {
          console.error('Errore nel recupero dati:', err);
          this.loading = false;
          this.error = true;
          return of(null);
        })
      )
      .subscribe(); // Sottoscrivi per avviare la chiamata
  }

  onRegionChange(): void {
    this.selectedCountry = null;
    this.selectedCity = null;
    this.uniqueCountriesForSelectedRegion = [];
    this.uniqueCitiesForSelectedCountry = [];
    this.expandedElement = null; // Resetta l'espansione
    if (this.selectedRegion && this.allGroupedEvents) {
      const eventsInRegion = this.allGroupedEvents[this.selectedRegion];
      if (eventsInRegion) {
        this.uniqueCountriesForSelectedRegion =
          this.getUniqueCountries(eventsInRegion);
      }
    }
    this.applyFilters();
  }

  onCountryChange(): void {
    this.selectedCity = null;
    this.uniqueCitiesForSelectedCountry = [];
    this.expandedElement = null; // Resetta l'espansione
    if (this.selectedCountry && this.selectedRegion && this.allGroupedEvents) {
      const eventsInRegion = this.allGroupedEvents[this.selectedRegion];
      const eventsInCountry = eventsInRegion.filter(
        (event) => event.country === this.selectedCountry
      );
      if (eventsInCountry) {
        this.uniqueCitiesForSelectedCountry =
          this.getUniqueCities(eventsInCountry);
      }
    }
    this.applyFilters();
  }

  onCityChange(): void {
    this.expandedElement = null; // Resetta l'espansione
    this.applyFilters();
  }

  private getUniqueCountries(events: AcledEvent[]): string[] {
    const countries = new Set<string>();
    events.forEach((event) => {
      if (event.country && event.country.trim() !== '') {
        countries.add(event.country.trim());
      }
    });
    const sortedCountries = Array.from(countries).sort();
    return ['Tutti i Paesi', ...sortedCountries];
  }

  private getUniqueCities(events: AcledEvent[]): string[] {
    const cities = new Set<string>();
    events.forEach((event) => {
      if (event.location && event.location.trim() !== '') {
        cities.add(event.location.trim());
      }
    });
    const sortedCities = Array.from(cities).sort();
    return ['Tutte le città', ...sortedCities];
  }

  private applyFilters(): void {
    let filteredEvents: AcledEvent[] = [];

    if (this.selectedRegion && this.allGroupedEvents) {
      filteredEvents = this.allGroupedEvents[this.selectedRegion] || [];

      if (this.selectedCountry && this.selectedCountry !== 'Tutti i Paesi') {
        filteredEvents = filteredEvents.filter(
          (event) => event.country === this.selectedCountry
        );
      }

      if (this.selectedCity && this.selectedCity !== 'Tutte le città') {
        filteredEvents = filteredEvents.filter(
          (event) => event.location === this.selectedCity
        );
      }
    }

    this.dataSource.data = filteredEvents;
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Metodo per gestire il click sulla riga e toggle dell'espansione
  toggleRow(element: AcledEvent) {
    // Se l'elemento cliccato è già espanso, lo collassa (setta a null), altrimenti lo espande.
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  // Aggiungi un trackBy per gli eventi nella tabella per migliorare le performance
  trackByEventId(index: number, event: AcledEvent): string {
    return event.event_id_cnty;
  }
}
