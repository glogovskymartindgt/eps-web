import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { NotificationType } from '../notification-type.enum';

@Component({
    selector: 'notification-snack-bar',
    templateUrl: './notification-snack-bar.component.html',
    styleUrls: ['./notification-snack-bar.component.scss']
})
export class NotificationSnackBarComponent implements OnInit {
    public constructor(@Inject(MAT_SNACK_BAR_DATA) public readonly data: { message: string, type: NotificationType }) {
    }

    public ngOnInit() {
    }

}
