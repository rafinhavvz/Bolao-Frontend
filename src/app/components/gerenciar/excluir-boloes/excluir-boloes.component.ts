import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-excluir-boloes',
  templateUrl: './excluir-boloes.component.html',
  styleUrls: ['./excluir-boloes.component.scss']
})
export class ExcluirBoloesComponent {

  boloes:any []=[];
  constructor(private api: ApiService,){
    
  }

  ngOnInit(){
    this.api.getBoloes().subscribe(res =>{
      this.boloes = res
    })
  }

}
