import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessorListagem } from './professor-listagem';

describe('ProfessorListagem', () => {
  let component: ProfessorListagem;
  let fixture: ComponentFixture<ProfessorListagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorListagem],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessorListagem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
