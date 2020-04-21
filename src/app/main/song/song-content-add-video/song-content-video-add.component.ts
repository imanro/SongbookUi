import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SbFormsService} from '../../../shared/services/forms.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SbFormErrors} from '../../../shared/models/form-errors.model';
import {SbSongContent} from '../../../shared/models/song-content.model';
import {CustomValidators} from 'ng2-validation';
import {SbSongContentTypeEnum} from '../../../shared/enums/song-content.type.enum';

@Component({
    selector: 'sb-song-content-video-add',
    templateUrl: './song-content-add-video.component.html',
    styleUrls: ['./song-content-add-video.component.scss']
})
export class SbSongContentVideoAddComponent implements OnInit, OnDestroy {

    @Input() formErrors$: Subject<SbFormErrors>;

    @Output() contentVideoAdd = new EventEmitter<SbSongContent>();

    contentAddVideoForm: FormGroup;

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
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    private buildForm(): void {
        this.contentAddVideoForm = this.fb.group({
            content: ['', [Validators.required, CustomValidators.url]],
        });
    }

    private assignFormErrors(): void {
        this.commonFormErrors = [];

        if (this.formErrors$) {
            this.formErrors$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(formErrors => {

                    if (formErrors) {

                        const unmapped = this.formService.bindErrors(formErrors, this.contentAddVideoForm);

                        if (unmapped.length > 0) {
                            this.commonFormErrors = [];
                            this.commonFormErrors = this.commonFormErrors.concat(unmapped);
                        }
                    }
                });
        }
    }

    getContentAddVideoFormControl(name: string): AbstractControl {
        return this.contentAddVideoForm.get(name);
    }

    handleContentVideoAdd(): void {
        if (this.contentAddVideoForm.valid) {
            const contentFormModel = this.prepareContentVideoAddFormModel();
            this.contentVideoAdd.next(contentFormModel);
        }
    }

    private prepareContentVideoAddFormModel(): SbSongContent {
        const content = new SbSongContent();
        content.type = SbSongContentTypeEnum.LINK;
        const formModel = this.contentAddVideoForm.value;
        content.content = formModel.content;
        return content;
    }



}
