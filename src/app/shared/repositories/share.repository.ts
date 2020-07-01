import {SbBaseRepository} from './base.repository';
import {SbSongContentEmailShare} from '../models/song-content-email-share.model';
import {Observable} from 'rxjs';
import {SbSongContentEmailShareMapper} from '../mappers/song-content-email-share.mapper';

import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({
        providedIn: 'root'
    }
)
export class SbShareRepository extends SbBaseRepository {

    private songContentEmailShareMapper: SbSongContentEmailShareMapper;

    contentEmailShare(model: SbSongContentEmailShare): Observable<void> {
        const mapper = this.getSongContentEmailShareMapper();
        const data = mapper.mapToData(model);

        const url = this.getApiUrl('/sharing/send-song-content-mail');

        console.log('Sending onto', url);

        return this.http.post<void>(url, data, this.getDefaultHttpPostOptions()).pipe(
            map(result => {
                return;
            }),
            catchError(this.handleHttpError<SbSongContentEmailShare>())
        );
    }

    private getSongContentEmailShareMapper(): SbSongContentEmailShareMapper {
        if (!this.songContentEmailShareMapper) {
            this.songContentEmailShareMapper = new SbSongContentEmailShareMapper();
        }

        return this.songContentEmailShareMapper;
    }
}

