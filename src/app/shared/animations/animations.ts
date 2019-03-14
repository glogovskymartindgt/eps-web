import { animate, style, transition, trigger } from '@angular/animations';

export const moveLeft = trigger('moveLeft', [
    transition('void => *', [
        style({
            transform: 'translateX(100px)'
        }),
        animate('0.3s ease-in')
    ]),
    transition('* => void', [
        animate(
            '0.1s 0.05s ease-out',
            style({
                transform: 'translateX(100px)'
            })
        )
    ])
]);
