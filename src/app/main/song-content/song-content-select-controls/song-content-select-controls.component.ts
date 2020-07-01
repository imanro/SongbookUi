import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SbSongExternalContentFunctionalType} from '../../../shared/models/song-external-content-functional-type.model';
import {SbSongExternalContentFunctionalTypeFactory} from '../../../shared/models/song-external-content-functional-type.factory';
import {MatCheckboxChange} from '@angular/material';
import {SbSongExternalContentFunctionalTypeEnum} from '../../../shared/enums/song-external-content-functional-type.enum';

@Component({
    selector: 'sb-song-content-select-controls',
    templateUrl: './song-content-select-controls.component.html',
    styleUrls: ['./song-content-select-controls.component.scss']
})
export class SbSongContentSelectControlsComponent implements OnInit {

    @Input() set typesSelected(types: SbSongExternalContentFunctionalType[]) {
        this.typesSelectedMap = {} as {[type in SbSongExternalContentFunctionalTypeEnum]: boolean};
        for (const type of types) {
            this.typesSelectedMap[type.type] = true;
        }
    }

    @Output() typeSelect = new EventEmitter<SbSongExternalContentFunctionalType>();

    @Output() typeUnselect = new EventEmitter<SbSongExternalContentFunctionalType>();

    allTypes: SbSongExternalContentFunctionalType[];

    // type map example here; see
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
    private typesSelectedMap: {[type in SbSongExternalContentFunctionalTypeEnum]: boolean};

    constructor() {
    }

    ngOnInit(): void {
        this.initAllTypes();
    }

    isTypeChecked(type: SbSongExternalContentFunctionalType): boolean {
        return this.typesSelectedMap && this.typesSelectedMap[type.type];
    }


    // ----
    // Handlers
    handleTypeToggle($event: MatCheckboxChange, type: SbSongExternalContentFunctionalType): void {
        if ($event.checked) {
            this.typeSelect.emit(type);
        } else {
            this.typeUnselect.emit(type);
        }
    }

    // ----
    // Privates
    private initAllTypes(): void {
        this.allTypes = SbSongExternalContentFunctionalTypeFactory.createAllExternalContentFunctionalTypes();
    }
}
