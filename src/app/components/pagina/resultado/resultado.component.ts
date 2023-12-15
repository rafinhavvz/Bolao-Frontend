import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  animations: [
    trigger('expandeContrai', [
      state('true', style({   height: '300px','overflow':'auto' })),
      state('false', style({ height: '0','overflow':'hidden'})),
      transition('false <=> true', animate('0.3s')),
    ]),
  ],
})
export class ResultadoComponent {

  mostrarBarra: boolean = false;

  toggleBarra() {
    this.mostrarBarra = !this.mostrarBarra;
  }

}
