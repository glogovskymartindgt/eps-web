import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hazelnutConfig } from '../../hazlenut/hazelnut-common/config/hazelnut-config';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

// TODO: remove project Service or add function to project service
export class ImagesService extends ProjectService<any> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService,) {
        super(http, 'images', notificationService, userService);
    }

    public uploadImages(files: File[]): Observable<any> {
        const formData = new FormData();
        for (const file of files) {
            formData.append('images', file, file.name);
        }
        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', this.userService.instant.authToken);
        return this.post({
            headers,
            url: `${hazelnutConfig.URL_API}/internal/images`,
            mapFunction: (e) => e,
            body: formData,
        });
    }

    public getImage(imageName: string): Observable<Blob> {
        return this.http.get(`${hazelnutConfig.URL_API}/internal/images/0/${imageName}`, {
                       headers: this.getHeader(),
                       responseType: 'blob',
                   })
                   .pipe(map((result) => {
                       return result as any;
                   }), catchError(this.handleError),);
    }
}
