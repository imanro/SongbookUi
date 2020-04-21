import {SbBaseRepository} from './base.repository';
import {SbSongContent} from '../models/song-content.model';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {SbSongContentMapper} from '../mappers/song-content.mapper';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SbSongContentRepository extends SbBaseRepository {

    save(entity: SbSongContent): Observable<SbSongContent> {

        const url = this.getApiUrl('/song-content');
        const data = this.mapToData(entity);

        console.log('Sending the data:', data);

        return this.http.post(url, data, this.getDefaultHttpPostOptions())
            .pipe(
                map<any, SbSongContent>(response => {
                    return this.mapToEntity(response);
                }),
                catchError(this.handleHttpError<SbSongContent>())
            );
    }


    private mapToEntity(data: any): SbSongContent {
        const mapper = new SbSongContentMapper();
        return mapper.mapToEntity(data);
    }

    private mapToData(entity: SbSongContent): any {
        const mapper = new SbSongContentMapper();
        return mapper.mapToData(entity);
    }

}