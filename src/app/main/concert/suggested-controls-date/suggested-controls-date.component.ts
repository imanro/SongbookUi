import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
    selector: 'sb-suggested-controls-date',
    templateUrl: './suggested-controls-date.component.html',
    styleUrls: ['./suggested-controls-date.component.scss']
})
export class SuggestedControlsDateComponent implements OnInit {

    @Input() suggestedDate: Date;

    @Output() suggestedDateChange = new EventEmitter<Date>();

    suggestedControlsForm: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.buildForm();
        this.assignFormValues();
    }

    handleSuggestedDateChange($event: MatDatepickerInputEvent<any>): void {
        if ($event.value) {
            const date = $event.value.toDate();
            this.suggestedDateChange.next(date);
        }
    }

    private buildForm(): void {
        this.suggestedControlsForm = this.fb.group({
            suggestedDate: [''],
        });
    }

    private assignFormValues(): void {
        this.suggestedControlsForm.patchValue({
            suggestedDate: this.suggestedDate
        });
    }

}
