import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {combineLatest, of} from 'rxjs';
import {SbSong} from '../../shared/models/song.model';
import {SbSongRepository} from '../../shared/repositories/song.repository';
import {SbConcertRepository} from '../../shared/repositories/concert.repository';
import {finalize, map, switchMap} from 'rxjs/operators';
import {SbSongContent} from '../../shared/models/song-content.model';
import {SbSongContentService} from '../../shared/services/song-content.service';
import {SbSongExternalContentFunctionalType} from '../../shared/models/song-external-content-functional-type.model';
import {SbSongContentRepository} from '../../shared/repositories/content.repository';
import {SbConcert} from '../../shared/models/concert.model';

@Component({
    selector: 'sb-song-content-container',
    templateUrl: './song-content-container.component.html',
    styleUrls: ['./song-content-container.component.scss']
})
export class SbSongContentContainerComponent implements OnInit {

    readonly PATH_CONCERT = 'concert';

    songs: SbSong[] = [];

    concert: SbConcert;

    contentItemsSelected: SbSongContent[] = [];

    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private songRepository: SbSongRepository,
        private concertRepository: SbConcertRepository,
        private songContentService: SbSongContentService,
        private songContentRepository: SbSongContentRepository
    ) {
    }

    ngOnInit(): void {
        this.processRoute();
    }

    // ------------------------
    // Handlers

    handleSongContentItemSelect(item: SbSongContent): void {
        // just put the item in selected array
        this.contentItemsSelected.push(item);
    }

    handleSongContentItemUnSelect(item: SbSongContent): void {
        // just filter selected array, excluding this item by id
        this.contentItemsSelected = this.contentItemsSelected.filter(curItem => curItem.id !== item.id);
    }

    handleSongContentTypeSelect(type: SbSongExternalContentFunctionalType): void {
        if (this.songs) {
            for (const song of this.songs) {
                // go by all songs -> content
                if (song.content) {
                    for (const content of song.content) {
                        if (this.songContentService.isContentBelongsToExternalFunctionalType(content, type)) {
                            // determine using service whether the item belongs to that type
                            this.contentItemsSelected.push(content);
                            // if so, put in selected content
                        }
                    }
                }
            }
        }
    }

    handleSongContentTypeUnSelect(type: SbSongExternalContentFunctionalType): void {
        if (this.contentItemsSelected) {
            for (const content of this.contentItemsSelected) {
                // go by currently selected items
                if (this.songContentService.isContentBelongsToExternalFunctionalType(content, type)) {
                    // determine using service whether the item belongs to that type
                    this.contentItemsSelected = this.contentItemsSelected.filter(curContent => curContent.id !== content.id);
                    // if so, filter that items
                }
            }
        }
    }


    handleContentViaEmailShare(): void {

        const ids = [];
        this.contentItemsSelected.map(curContent => {
            ids.push(curContent.id);
        });

        if (ids.length > 0) {
            this.router.navigate(['share/email-content/' + this.concert.id + '/' + ids.join(',')]);
        } else {
            this.router.navigate(['share/email-content/' + this.concert.id]);
        }
    }

    handlePdfCompile(): void {
        this.songContentRepository.pdfCompile(this.contentItemsSelected);
    }

    handleSongContentSync(song: SbSong): void {
        this.isLoading = true;
        this.songRepository.syncSongContent(song)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(updatedSong => {
                if (this.concert) {
                    // reload all the songs
                    const index = this.songs.findIndex(curSong => curSong.id === song.id);

                    console.log('To update', index);

                    if (index !== -1) {
                        this.songs[index] = updatedSong;
                    }
                    // this.loadSongContentByConcert(this.concert.id);
                }
            });
    }

    // ------------------------
    // Privates
    private processRoute(): void {
        combineLatest([
            this.route.url
        ]).subscribe(([url]: [UrlSegment[]]) => {

            switch (url[0].path) {
                default:
                    console.error('Unknown path');
                    break;
                case(this.PATH_CONCERT):
                    console.log('Load concert content by concert id');
                    this.loadSongContentByConcert(Number.parseInt(url[1].path, 10));
                    break;
            }
            console.log('The url:', url);
        });
    }

    private loadSongContentByConcert(concertId: number): void {

        // so when we have id of concert, we can obtain songs of it
        this.concertRepository.findConcert(concertId)
            .pipe(
                map(concert => {
                    const songIds: number[] = [];
                    for (const item of concert.items) {
                        songIds.push(item.song.id);
                    }
                    return [concert, songIds];
                }),
                switchMap(([concert, songIds]: [SbConcert, number[]]) => {
                    if (songIds.length > 0) {
                        return combineLatest([of(concert), this.songRepository.findMultipleSongs(songIds)]);
                    } else {
                        return of(null);
                    }
                })
            ).subscribe((res: [SbConcert, SbSong[]] | null) => {
            if (res !== null) {
                this.concert = res[0];
                this.songs = res[1];
            }
        });

        // and then we can have all the contents by these concrete songs ids

        // + we need an endpoint to load all songs by ids
        console.log('Load song content by concertId', concertId);
    }
}
