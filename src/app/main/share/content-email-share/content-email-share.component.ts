import {SbSongContent} from '../../../shared/models/song-content.model';
import {SbSettings} from '../../../shared/models/settings.model';
import {SbSettingsKeysEnum} from '../../../shared/enums/settings-keys.enum';
import {SbConcert} from '../../../shared/models/concert.model';
import {SbConcertService} from '../../../shared/services/concert.service';
import {SbSongContentEmailShare} from '../../../shared/models/song-content-email-share.model';
import {SbFormErrors} from '../../../shared/models/form-errors.model';

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SbFormsService} from '../../../shared/services/forms.service';

@Component({
    selector: 'sb-content-email-share',
    templateUrl: './content-email-share.component.html',
    styleUrls: ['./content-email-share.component.scss']
})
export class ContentEmailShareComponent implements OnInit, OnDestroy {

    @Input() contents: SbSongContent[];

    @Input() concert: SbConcert;

    @Input() settings: SbSettings;

    @Input() isLoading = false;

    @Input() formErrors$: Subject<SbFormErrors>;

    @Output() emailShare = new EventEmitter<SbSongContentEmailShare>();

    shareForm: FormGroup;

    commonFormErrors = [];

    private unsubscribe$: Subject<void> = new Subject();

    constructor(
        private fb: FormBuilder,
        private concertService: SbConcertService,
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


    getShareFormField(name: string): AbstractControl {
        return this.shareForm.get(name);
    }

    // ----
    // Handlers
    handleEmailShare(): void {
        const model = new SbSongContentEmailShare();

        const value = this.shareForm.value;

        model.to = value.mailRecipients;
        model.subject = value.mailSubject;
        model.body = value.mailBody;
        model.isEmbedContent = value.isEmbedContent;
        model.isAddSequenceToFileNames = value.isAddSequenceToFileNames;
        model.contents = this.contents;

        this.emailShare.next(model);
    }

    // ----
    // Privates
    private buildForm(): void {
        this.shareForm = this.fb.group({
            mailRecipients: ['', [Validators.required]],
            mailSubject: ['', [Validators.required]],
            mailBody: ['', [Validators.required]],
            isEmbedContent: [''],
            isAddSequenceToFileNames: [''],
        });

    }

    private assignFormValues(): void {
        let s;
        this.shareForm.patchValue({
            // tslint:disable-next-line:no-conditional-assignment
            mailRecipients: (s = this.settings.getSetting(SbSettingsKeysEnum.SHARING_PROVIDER_MAIL_CONTENT_MAIL_DEFAULT_RECIPIENTS)) ? s.getValue() : '',
            // tslint:disable-next-line:no-conditional-assignment
            mailSubject: (s = this.settings.getSetting(SbSettingsKeysEnum.SHARING_PROVIDER_MAIL_DEFAULT_SUBJECT)) ? s.getValue() : '',
            // tslint:disable-next-line:no-conditional-assignment
            mailBody: this.composeMailBody(),
            isEmbedContent: true,
            isAddSequenceToFileNames: true
        });
    }

    private getConcertSongNamesGlued(): string {
        const rows = [];
        for (const item of this.concert.items) {
            if (item.song) {
                rows.push(item.song.header);
            }
        }

        return rows.join("\n");
    }

    private composeMailBody(): string {
        let s;
        // tslint:disable-next-line:no-conditional-assignment
        const body = (s = this.settings.getSetting(SbSettingsKeysEnum.SHARING_PROVIDER_MAIL_CONTENT_MAIL_BODY_TEMPLATE)) ? s.getValue() : '';
        return this.concertService.getConcertSongNamesGlued(this.concert) + "\n\n" + body;
    }

    private assignFormErrors(): void {
        this.commonFormErrors = [];
        console.log('ass');

        if (this.formErrors$) {
            this.formErrors$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(formErrors => {
                    console.log('came', formErrors);
                    if (formErrors) {
                        const unmapped = this.formService.bindErrors(formErrors, this.shareForm);

                        if (unmapped.length > 0) {
                            this.commonFormErrors = [];
                            this.commonFormErrors = this.commonFormErrors.concat(unmapped);
                        }
                    }
                });
        }
    }
}
