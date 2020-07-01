import {SbSongContentRepository} from '../../shared/repositories/content.repository';
import {SbSongContent} from '../../shared/models/song-content.model';
import {SbSettings} from '../../shared/models/settings.model';
import {SbSettingsRepository} from '../../shared/repositories/settings.repository';
import {SbConcertRepository} from '../../shared/repositories/concert.repository';
import {SbConcert} from '../../shared/models/concert.model';
import {AppConfig} from '../../app.config';
import {SbSongContentEmailShare} from '../../shared/models/song-content-email-share.model';
import {SbShareRepository} from '../../shared/repositories/share.repository';
import {SbFormErrors} from '../../shared/models/form-errors.model';
import {SbFormsService} from '../../shared/services/forms.service';

import { Component, OnInit } from '@angular/core';
import {combineLatest, interval, Subject} from 'rxjs';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';


@Component({
    selector: 'sb-share-container',
    templateUrl: './share-container.component.html',
    styleUrls: ['./share-container.component.scss']
})
export class SbShareContainerComponent implements OnInit {

    readonly PATH_EMAIL_CONTENT = 'email-content';

    songContents: SbSongContent[] = [];

    concert: SbConcert;

    settings: SbSettings;

    formErrors$ = new Subject<SbFormErrors>();

    isLoading = false;

    constructor(
        private appConfig: AppConfig,
        private route: ActivatedRoute,
        private router: Router,
        private concertRepository: SbConcertRepository,
        private contentRepository: SbSongContentRepository,
        private settingRepository: SbSettingsRepository,
        private shareRepository: SbShareRepository,
        private formsService: SbFormsService,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
        this.assignSettings();
        this.processRoute();
    }

    // ----
    // Handlers
    handleEmailShare(model: SbSongContentEmailShare): void {
        console.log('Received', model);
        this.isLoading = true;

        this.shareRepository.contentEmailShare(model)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(() => {
                this.snackBar.open('The mail sent', 'Ok', {
                    duration: this.appConfig.snackBarDelayMs,
                });

            }, err => {
                const formErrors = this.createFormErrors();

                formErrors.common.push('An error has occurred during the form sending');

                const message = err.message;
                formErrors.common.push(message);
                this.formsService.assignServerFieldErrors(err.formErrors, formErrors);
                this.formErrors$.next(formErrors);
            });
    }

    // ----
    // Privates
    private assignSettings(): void {
        this.settingRepository.fetchSettings().subscribe(settings => {
            console.log(settings);
            this.settings = settings;
        });
    }

    private processRoute(): void {
        combineLatest([
            this.route.url
        ]).subscribe(([url]: [UrlSegment[]]) => {
            if (url.length) {
                switch (url[0].path) {
                    default:
                        console.error('Unknown path');
                        break;
                    case(this.PATH_EMAIL_CONTENT):

                        const concertId = Number.parseInt(url[1].path, 10);
                        this.loadConcert(concertId);

                        if (url[2]) {
                            // song content given
                            const idsRaw = url[2].path.split(',');
                            const ids: number[] = [];

                            idsRaw.map(curStr => {
                                ids.push(Number.parseInt(curStr.trim(), 10));
                            });

                            this.loadSongContents(ids);
                        }
                        break;
                }

            } else {
                console.error('Unknown path given');
            }
        });
    }

    private loadConcert(id: number): void {
        this.concertRepository.findConcert(id).subscribe(concert => {
            this.concert = concert;
            /*
            interval(2000).subscribe(() => {
                this.assignFormErrorsDummy();
            });
             */
        });
    }

    private loadSongContents(ids: number[]): void {
        this.contentRepository.findSongContents(ids)
            .subscribe(contents => {
                console.log('The content loaded', contents);
                this.songContents = contents;
            });
    }

    private createFormErrors() {
        return new SbFormErrors();
    }

    private assignFormErrorsDummy(): void {
        const formErrors = this.createFormErrors();
        const message = "The message";
        console.log('put', formErrors);
        formErrors.common.push(message);
        this.formErrors$.next(formErrors);

    }
}
