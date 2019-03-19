import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectInterface } from '../interfaces/project.interface';
import { SecondaryHeader } from '../interfaces/secondary-header.interface';
import { AppConstants } from '../utils/constants';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private secondaryHeader = new Subject<SecondaryHeader>();
    public secondaryHeaderNotifier$ = this.secondaryHeader.asObservable();

    public constructor(private http: HttpClient,
                       private readonly router: Router) {
    }

    public setSecondaryHeaderContent(secondaryHeader: SecondaryHeader) {
        this.secondaryHeader.next(secondaryHeader);
    }

    public filterProjects(state: 'all' | 'open' | 'closed'): Observable<ProjectInterface[]> {
        return this.http.post<ProjectInterface[]>(environment.URL_API + '/filter', {state});
        // return this.http.post<ProjectInterface[]>(environment.URL_API + '/filter', { state: state }, { headers: this.getHeader() });
    }

}
