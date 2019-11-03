import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {AppDataFilter} from '../models/data-filter.model';
import {Observable} from 'rxjs';
import {SbSong} from '../models/song.model';
import {ApiResult} from '../models/api-result.model';

@Injectable()
export abstract class SbSongRepository extends SbBaseRepository {
    abstract findSongs(filter: AppDataFilter): Observable<ApiResult<SbSong>>;
}
