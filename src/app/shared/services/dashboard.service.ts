import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectInterface } from '../interfaces/project.interface';
import { SecondaryHeader } from '../interfaces/secondary-header.interface';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private secondaryHeader = new Subject<SecondaryHeader>();
    public secondaryHeaderNotifier$ = this.secondaryHeader.asObservable();

    public constructor(private http: HttpClient,
    ) {
    }

    public setSecondaryHeaderContent(secondaryHeader: SecondaryHeader) {
        this.secondaryHeader.next(secondaryHeader);
    }

    public filterProjects(state: 'all' | 'open' | 'closed'): Observable<ProjectInterface[]> {
        return this.http.post<ProjectInterface[]>(environment.URL_API + '/filter', {state});
        // return this.http.post<ProjectInterface[]>(environment.URL_API + '/filter', { state: state }, { headers: this.getHeader() });
    }

}
