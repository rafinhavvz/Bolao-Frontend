import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarBoloesComponent } from './criar-boloes.component';

describe('CriarBoloesComponent', () => {
  let component: CriarBoloesComponent;
  let fixture: ComponentFixture<CriarBoloesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarBoloesComponent]
    });
    fixture = TestBed.createComponent(CriarBoloesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
