import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    selector: 'sb-song-content-action-controls',
    templateUrl: './song-content-action-controls.component.html',
    styleUrls: ['./song-content-action-controls.component.scss']
})
export class SongContentActionControlsComponent implements OnInit {

    @Output()
    pdfCompile = new EventEmitter<void>();

    @Output()
    contentViaEmailShare = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit(): void {
    }

    handlePdfCompile(): void {
        this.pdfCompile.emit();
    }

    handleShareViaEmail(): void {
        this.contentViaEmailShare.emit();
    }
}
