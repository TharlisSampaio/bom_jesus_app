import { Component, inject } from '@angular/core';
import { ProfessorService } from '../../services/professor-service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-professor-listagem',
  styleUrl: './professor-listagem.css',
  templateUrl: './professor-listagem.html',
})
export class ProfessorListagem {
  private professorService = inject(ProfessorService)

  professores = this.professorService.professores

  ngOnInit(): void {
    this.professorService.listarTodos();
  }

  deletarLogico(id: number): void {
    if (confirm('Tem certeza que deseja desativar (exclusão lógica) este registro?')) {
      // Chama o método do serviço que dispara a requisição para o backend
      this.professorService.deleteLogico(id);
    }
  }
}