import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioAcumuladoComponent } from './relatorio-acumulado.component';

describe('RelatorioAcumuladoComponent', () => {
  let component: RelatorioAcumuladoComponent;
  let fixture: ComponentFixture<RelatorioAcumuladoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioAcumuladoComponent]
    });
    fixture = TestBed.createComponent(RelatorioAcumuladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
