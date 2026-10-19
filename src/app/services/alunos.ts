import { inject, Injectable, Service, signal } from '@angular/core';
import { Alunos } from '../models/alunos';
import { Status } from '../models/status';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AlunosService {
    private http = inject(HttpClient)
    private readonly API_URL = 'http://localhost:8080/api/students'

    // Estado dos alunos usando Signals
    private alunosSignal = signal<Alunos[]>([]);
    readonly alunos = this.alunosSignal.asReadonly();

    // Método para carregar a lista do banco de dados (GET)
    listarTodos(): void {
        this.http.get<Alunos[]>(this.API_URL).subscribe({
            next: (dados) => this.alunosSignal.set(dados),
            error: (err) => console.error('Erro ao buscar alunos:', err)
        });
    }

    // Método para salvar um novo aluno no banco de dados (POST)
    adicionar(alunoPayload: Alunos): Observable<Alunos> {
        return this.http.post<Alunos>(this.API_URL, alunoPayload).pipe(
            // 🌟 CORREÇÃO: Adicionado o tipo ': Alunos' no parâmetro
            tap((novoAluno: Alunos) => {
                // Atualiza a listagem local em tempo real na tela após o sucesso do banco
                this.alunosSignal.update(lista => [...lista, novoAluno]);
            })
        );
    }

    deleteLogico(id: number): void {
        this.http.delete<Alunos>(`${this.API_URL}/${id}`).subscribe({
            next: (alunoAtualizado) => {
                // Procura o aluno na lista e substitui pelo objeto desativado vindo do banco
                this.alunosSignal.update(lista =>
                    lista.map(aluno => aluno.id === id ? alunoAtualizado : aluno)
                );
            },
            error: (err) => console.error('Erro ao desativar aluno:', err)
        });
    }

    buscarPorId(id: number): Observable<Alunos> {
        return this.http.get<Alunos>(`${this.API_URL}/${id}`);
    }

    atualizar(id: number, alunoPayload: any): Observable<Alunos> {
        return this.http.put<Alunos>(`${this.API_URL}/${id}`, alunoPayload).pipe(
            tap((alunoAtualizado: any) => {
                // Atualiza a lista do Signal local substituindo o registro antigo
                this.alunosSignal.update(lista =>
                    lista.map(a => a.id === id ? alunoAtualizado : a)
                );
            })
        );
    }
}
