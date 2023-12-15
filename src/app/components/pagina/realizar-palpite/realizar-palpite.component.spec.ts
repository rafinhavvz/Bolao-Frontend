import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarPalpiteComponent } from './realizar-palpite.component';

describe('RealizarPalpiteComponent', () => {
  let component: RealizarPalpiteComponent;
  let fixture: ComponentFixture<RealizarPalpiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealizarPalpiteComponent]
    });
    fixture = TestBed.createComponent(RealizarPalpiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
