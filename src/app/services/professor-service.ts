import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, } from '@angular/core';
import { Professor } from '../models/professor';
import { Observable, tap } from 'rxjs';
import { Alunos } from '../models/alunos';

@Injectable({
    providedIn: 'root'
})
export class ProfessorService {
    private http = inject(HttpClient)
    private readonly API_URL = 'http://localhost:8080/api/teachers'

    private professoresSignal = signal<Professor[]>([])
    readonly professores = this.professoresSignal.asReadonly()

    listarTodos(): void {
        this.http.get<Professor[]>(this.API_URL).subscribe({
            next: (dados) => this.professoresSignal.set(dados),
            error: (err) => console.error('Error ao buscar professores', err)
        })
    }

    adicionar(professorPayload: Professor): Observable<Professor> {
        return this.http.post<Professor>(this.API_URL, professorPayload).pipe(
            tap((novoProfessor) => {
                this.professoresSignal.update(lista => [...lista, novoProfessor])
            })
        )
    }

    deleteLogico(id: number): void {
        this.http.delete<Professor>(`${this.API_URL}/${id}`).subscribe({
            next: (professorAtualizado) => {
                this.professoresSignal.update(lista =>
                    lista.map(professor => professor.id === id ? professorAtualizado : professor)
                );
            },
            error: (err) => console.error('Erro ao desativar aluno:', err)
        });
    }

    buscarPorId(id: number): Observable<Professor> {
        return this.http.get<Professor>(`${this.API_URL}/${id}`);
    }


    atualizar(id: number, professorPayload: any): Observable<any> {
        return this.http.put<any>(`${this.API_URL}/${id}`, professorPayload).pipe(
            tap((profAtualizado: any) => {
                this.professoresSignal.update(lista =>
                    lista.map(p => p.id === id ? profAtualizado : p)
                );
            })
        );
    }

}
