import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbAutofocusDirective } from './autofocus.directive';



@NgModule({
  declarations: [SbAutofocusDirective],
  imports: [
    CommonModule
  ],
    exports: [
      SbAutofocusDirective
    ]
})
export class SbUiUtilsModule { }
