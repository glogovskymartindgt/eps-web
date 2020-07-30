import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { hazelnutConfig } from '../../hazelnut/hazelnut-common/config/hazelnut-config';
import { FileService } from '../core/file.service';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

// TODO: remove project Service or add function to project service
export class ImagesService extends ProjectService<any> {
    private readonly imageStore: {[id: string]: string} = {};

    public constructor(
        http: HttpClient,
        notificationService: NotificationService,
        userService: ProjectUserService,
        private readonly fileService: FileService,
    ) {
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
            mapFunction: (response: any): any => response,
            body: formData,
        });
    }

    public getImage(imageName: string): Observable<void | Blob> {
        return this.http.get(`${hazelnutConfig.URL_API}/internal/images/0/${imageName}`, {
                       headers: this.getHeader(),
                       responseType: 'blob',
                   })
                   .pipe(map((result: Blob): void => {
                       return result as any;
                   }), catchError(this.handleError));
    }

    public getImageCached(imagePath: string): Observable<string> {
        if (this.imageStore[imagePath]) {
            return of(this.imageStore[imagePath]);
        }

        return this.getImage(imagePath)
            .pipe(
                switchMap((blob: Blob): Observable<string> => {
                    if (!blob) {
                        return of(null);
                    }

                    return this.fileService.readFile$(blob);
                }),
                tap((imageSource: string): void => {
                    if (!!imageSource) {
                        this.imageStore[imagePath] = imageSource;
                    }
                }),
            );
    }
}
