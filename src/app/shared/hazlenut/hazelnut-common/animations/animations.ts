import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const detailExpand = trigger('detailExpand', [
    state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const fadeEnterLeave = trigger('fadeEnterLeave', [
    state('in', style({opacity: 1})),
    transition('void => *', [
        style({
            opacity: 0,
        }),
        animate('0.4s ease-in'),
    ]),
    transition('* => void', [
        animate('0.2s 0.1s ease-out', style({
            opacity: 0,
        })),
    ]),
]);

export const enterLeave = trigger('enterLeave', [
    transition(':enter', [
        style({transform: 'translateY(-20%)'}),
        animate(400),
    ]),
    transition(':leave', [
        group([
            animate('0.3s ease', style({height: '0px'})),
            animate('0.3s ease', style({opacity: 0})),
        ]),
    ]),
]);

export const enterLeaveSmooth = trigger('enterLeaveSmooth', [
    transition(':enter', [
        style({transform: 'translateY(-20%)', height: '*'}),
        animate(400),
    ]),
    transition(':leave', [
        group([
            animate('0.3s ease', style({height: '0px'})),
            animate('0.3s ease', style({opacity: 0})),
        ]),
    ]),
]);

export const routeAnimations = trigger('routeAnimations', [
    transition('* <=> *', [
        style({position: 'relative', height: '90vh', overflow: 'hidden'}),
        query(
            ':enter, :leave',
            [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    overflow: 'hidden'
                })
            ],
            {optional: true}
        ),
        query(':enter', [style({left: '-100%'})], {optional: true}),
        query(':leave', animateChild(), {optional: true}),
        group([
            query(':leave', [animate('200ms ease-out', style({left: '100%'}))], {optional: true}),
            query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true})
        ]),
        query(':enter', animateChild(), {optional: true})
    ])
]);

export const moveDown = trigger('moveDown', [
    transition('void => *', [
        style({
            transform: 'translateY(-50px)'
        }),
        animate('0.3s ease-in')
    ]),
    transition('* => void', [
        animate(
            '0.1s 0.05s ease-out',
            style({
                transform: 'translateY(-50px)'
            })
        )
    ])
]);
