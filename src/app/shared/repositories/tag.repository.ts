import { Injectable} from '@angular/core';
import {SbBaseRepository} from './base.repository';
import {SbTag} from '../models/tag.model';
import {Observable} from 'rxjs';

@Injectable()
export abstract class SbTagRepository extends SbBaseRepository {
    abstract saveTag(tag: SbTag): Observable<SbTag>;
}
