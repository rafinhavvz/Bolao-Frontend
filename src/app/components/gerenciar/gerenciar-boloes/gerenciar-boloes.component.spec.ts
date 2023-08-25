import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarBoloesComponent } from './gerenciar-boloes.component';

describe('GerenciarBoloesComponent', () => {
  let component: GerenciarBoloesComponent;
  let fixture: ComponentFixture<GerenciarBoloesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GerenciarBoloesComponent]
    });
    fixture = TestBed.createComponent(GerenciarBoloesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
