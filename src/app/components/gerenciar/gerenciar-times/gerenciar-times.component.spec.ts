import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarTimesComponent } from './gerenciar-times.component';

describe('GerenciarTimesComponent', () => {
  let component: GerenciarTimesComponent;
  let fixture: ComponentFixture<GerenciarTimesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GerenciarTimesComponent]
    });
    fixture = TestBed.createComponent(GerenciarTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
