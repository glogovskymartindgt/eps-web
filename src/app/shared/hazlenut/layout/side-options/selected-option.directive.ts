import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[selectedOption]'
})
export class SelectedOptionDirective {

    // TODO dont work yet

    @Input() public selectedOption: boolean;

    public constructor(private readonly el: ElementRef) {
    }

    @HostListener('click', ['$event'])
    public onClick() {
        console.log('x', this.selectedOption);
        this.el.nativeElement.classList.add(this.selectedOption ? 'side-option-selected' : 'side-option-unselected');
        this.el.nativeElement.classList.remove(!this.selectedOption ? 'side-option-selected' : 'side-option-unselected');
    }

}
