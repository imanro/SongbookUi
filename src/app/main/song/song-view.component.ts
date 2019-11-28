import {Component, Input, OnInit} from '@angular/core';
import {SbSong} from '../../shared/models/song.model';

@Component({
  selector: 'sb-song-view',
  templateUrl: './song-view.component.html',
  styleUrls: ['./song-view.component.scss']
})
export class SongViewComponent implements OnInit {

    @Input()
    song: SbSong;

  constructor() { }

  ngOnInit(): void {
  }

  getHeadersString(): string {
      if (this.song.headers) {
          const array = [];
          for (const header of this.song.headers) {
              array.push(header.content);
          }

          return array.join(', ');

      } else {
          return '';
      }
  }

}
