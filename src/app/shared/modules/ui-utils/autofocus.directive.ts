import {Directive, ElementRef, Input, OnInit} from '@angular/core';

// https://stackoverflow.com/questions/41873893/angular2-autofocus-input-element

@Directive({
    selector: '[sbAutofocus]'
})
export class SbAutofocusDirective implements OnInit{
    private _autofocus;
    constructor(private el: ElementRef)
    {
    }

    ngOnInit(): void
    {
        if (this._autofocus || typeof this._autofocus === "undefined")
            this.el.nativeElement.focus();
        //For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
    }

    @Input() set autofocus(condition: boolean)
    {
        this._autofocus = condition !== false;
    }

}