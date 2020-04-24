import {Component, Input, OnInit} from '@angular/core';
import {SbConcert} from '../../../shared/models/concert.model';

@Component({
    selector: 'sb-concert-summary',
    templateUrl: './concert-summary.component.html',
    styleUrls: ['./concert-summary.component.scss']
})
export class ConcertSummaryComponent implements OnInit {

    @Input() concert: SbConcert;

    constructor() {
    }

    ngOnInit() {
    }

}
