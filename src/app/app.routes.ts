import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'alunos', pathMatch: 'full' },
  {
    path: 'alunos',
    loadComponent: () => import('./components/alunos/alunos').then(m => m.Alunos),
  },
  {
    path: 'alunos/novo',
    loadComponent: () => import('./components/cadastro-aluno/cadastro-aluno').then(m => m.CadastroAluno),
  },
  {
    path: 'professores',
    loadComponent: () => import('./components/professor-listagem/professor-listagem').then(m => m.ProfessorListagem)
  },
  {
    path: 'professores/novo',
    loadComponent: () => import('./components/cadastro-professor/cadastro-professor').then(m => m.CadastroProfessor)
  },
  {
    path: 'alunos/editar/:id',
    loadComponent: () => import('./components/cadastro-aluno/cadastro-aluno').then(m => m.CadastroAluno)
  },
  {
    path: 'professores/editar/:id',
    loadComponent: () => import('./components/cadastro-professor/cadastro-professor').then(m => m.CadastroProfessor)
  }
];
