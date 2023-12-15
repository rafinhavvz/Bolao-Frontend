import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCuponsComponent } from './relatorio-cupons.component';

describe('RelatorioCuponsComponent', () => {
  let component: RelatorioCuponsComponent;
  let fixture: ComponentFixture<RelatorioCuponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioCuponsComponent]
    });
    fixture = TestBed.createComponent(RelatorioCuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
