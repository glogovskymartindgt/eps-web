import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SecondaryHeader } from '../interfaces/secondary-header.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProjectInterface } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private secondaryHeader = new Subject<SecondaryHeader>();
  secondaryHeaderNotifier$ = this.secondaryHeader.asObservable();

  constructor(private http: HttpClient) { }

  public setSecondaryHeaderContent(secondaryHeader: SecondaryHeader) {
    this.secondaryHeader.next(secondaryHeader);
  }

  public filterProjects(state: 'all' | 'open' | 'closed'): Observable<ProjectInterface[]> {
    return this.http.post<ProjectInterface[]>(environment.URL_API + '/filter', { state: state } );
    // return this.http.post<ProjectInterface[]>(environment.URL_API + '/filter', { state: state }, { headers: this.getHeader() });
  }

}