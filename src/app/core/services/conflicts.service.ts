import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AcledEvent } from '../../shared/interfaces/acled.interface';

export type GroupedAcledEvents = { [regionName: string]: AcledEvent[] };

@Injectable({
  providedIn: 'root',
})
export class ConflictsService {
  private apiUrl = `${environment.apiUrlLocal}/conflict`;

  constructor(private http: HttpClient) {}

  getConflitti(): Observable<GroupedAcledEvents> {
    return this.http.get<GroupedAcledEvents>(this.apiUrl);
  }
}
