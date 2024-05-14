import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeshbordComponent } from './deshbord.component';

describe('DeshbordComponent', () => {
  let component: DeshbordComponent;
  let fixture: ComponentFixture<DeshbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeshbordComponent]
    });
    fixture = TestBed.createComponent(DeshbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
