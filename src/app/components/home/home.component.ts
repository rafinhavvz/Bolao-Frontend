import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy  {
  boloes: any[] = [];
  private subscription: Subscription | undefined = undefined;

  constructor(private api: ApiService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription = this.api.getBoloes().subscribe({
      next: (res: any) => {
        this.boloes = res;
        console.log(this.boloes);
      },
      error: (error: any) => {
        console.error('Erro ao carregar os bolões:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
