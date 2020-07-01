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

    findSongContents(ids: number[]): Observable<SbSongContent[]> {
        const url = this.getApiUrl('/song-content/?ids=' + ids.join(','));

        return this.http.get(url)
            .pipe(
                map<any, SbSongContent[]>(response => {
                    const contents: SbSongContent[] = [];

                    for (const row of response) {
                        contents.push(this.mapToEntity(row));
                    }

                    return contents;
                }),
            );
    }

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

    delete(entity: SbSongContent): Observable<any> {

        const url = this.getApiUrl('/song-content/' + entity.id);

        return this.http.delete(url)
            .pipe(
                catchError(this.handleHttpError<SbSongContent>())
            );
    }

    pdfCompile(contents: SbSongContent[]): void {
        const ids: number[] = [];

        for (const content of contents) {
            ids.push(content.id);
        }

        const url = this.getApiUrl('/song-content/pdfCompile?ids=' + ids.join(','));

        if (ids.length > 0) {
            window.location.href = url;
        } else {
            console.error('Empty contents list given');
        }
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