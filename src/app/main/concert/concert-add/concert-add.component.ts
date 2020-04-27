import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {Subject} from 'rxjs';
import {SbFormErrors} from '../../../shared/models/form-errors.model';
import {SbSongContentTypeEnum} from '../../../shared/enums/song-content.type.enum';
import {SbFormsService} from '../../../shared/services/forms.service';
import {takeUntil} from 'rxjs/operators';
import {SbSongContent} from '../../../shared/models/song-content.model';
import {SbConcert} from '../../../shared/models/concert.model';

@Component({
  selector: 'sb-concert-add',
  templateUrl: './concert-add.component.html',
  styleUrls: ['./concert-add.component.scss']
})
export class ConcertAddComponent implements OnInit, OnDestroy {

    @Input() formErrors$: Subject<SbFormErrors>;

    @Input() concert: SbConcert;

    @Output() concertAdd = new EventEmitter<SbConcert>();

    concertAddForm: FormGroup;

    commonFormErrors = [];

    private unsubscribe$: Subject<void> = new Subject();

    constructor(
        private fb: FormBuilder,
        private formService: SbFormsService
    ) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.assignFormErrors();
        this.assignFormValues();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    private buildForm(): void {
        this.concertAddForm = this.fb.group({
            time: [''],
            title: [''],
            isDraft: [''],
        });
    }

    private assignFormValues(): void {
            this.concertAddForm.patchValue({
                time: this.concert.time,
                title: this.concert.title,
                isDraft: this.concert.isDraft});
    }

    private assignFormErrors(): void {
        this.commonFormErrors = [];

        if (this.formErrors$) {
            this.formErrors$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(formErrors => {

                    if (formErrors) {

                        const unmapped = this.formService.bindErrors(formErrors, this.concertAddForm);

                        if (unmapped.length > 0) {
                            this.commonFormErrors = [];
                            this.commonFormErrors = this.commonFormErrors.concat(unmapped);
                        }
                    }
                });
        }
    }

    getContentAddVideoFormControl(name: string): AbstractControl {
        return this.concertAddForm.get(name);
    }

    handleContentVideoAdd(): void {
        if (this.concertAddForm.valid) {
            const concertAddModel = this.prepareConcertAddModel();
            this.concertAdd.next(concertAddModel);
        }
    }

    private prepareConcertAddModel(): SbConcert {
        const concert = new SbConcert();

        const formModel = this.concertAddForm.value;
        concert.title = formModel.title;
        concert.time = formModel.time;
        concert.isDraft = formModel.isDraft;
        return concert;
    }


}
