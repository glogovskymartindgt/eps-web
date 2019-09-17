import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HazelnutConfig } from '../../hazlenut/hazelnut-common/config/hazelnut-config';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class AttachmentService extends ProjectService<any> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService, ) {
        super(http, 'attachment', notificationService, userService);
    }

    public uploadAttachment(files: File[]): Observable<any> {
        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file, file.name);
        }
        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', this.userService.instant.authToken);
        return this.post({
            headers,
            url: `${HazelnutConfig.URL_API}/attachment/upload`,
            mapFunction: (e) => e,
            body: formData,
        });
    }

    public getAttachment(attachmentName: string): Observable<Blob> {
        return this.http.get(`${HazelnutConfig.URL_API}/attachment/${attachmentName}`, {
                       headers: this.getHeader(),
                       responseType: 'blob',
                   })
                   .pipe(map((result) => {
                       return result as any;
                   }), catchError(this.handleError), );
    }
}
