import { Component, inject } from '@angular/core';
import { AlunosService } from '../../services/alunos';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-alunos',
  styleUrl: './alunos.css',
  templateUrl: './alunos.html',
})
export class Alunos {
  private alunoService = inject(AlunosService)

  // 1. Guarde a referência para o SIGNAL exposto pelo serviço (não chame o método aqui!)
  alunos = this.alunoService.alunos; 

  ngOnInit(): void {
    this.alunoService.listarTodos(); 
  }

  deletarLogico(id: number): void {
  if (confirm('Tem certeza que deseja desativar (exclusão lógica) este registro?')) {
    // Chama o método do serviço que dispara a requisição para o backend
    this.alunoService.deleteLogico(id);
  }
}

}
