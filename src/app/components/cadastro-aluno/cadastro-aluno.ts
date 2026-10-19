import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlunosService } from '../../services/alunos';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule,],
  selector: 'app-cadastro-aluno',
  styleUrl: './cadastro-aluno.css',
  templateUrl: './cadastro-aluno.html',
})
export class CadastroAluno implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private alunoService = inject(AlunosService);
  private router = inject(Router);

  idAluno: number | null = null;
  isEdicao = false;

  // Estrutura do formulário reativo
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phoneNumber: ['', [Validators.required]],
    emailAddress: ['', [Validators.required, Validators.email]],
    studentNumber: ['', [Validators.required]],
    address: this.fb.array([this.criarGrupoEndereco()])
  });

  // Método auxiliar para criar a estrutura padrão de um endereço
  private criarGrupoEndereco() {
    return this.fb.group({
      id: [null as number | null], // 🌟 OBRIGATÓRIO: Garante o mapeamento do ID do endereço
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      zipCode: ['', Validators.required],
      country: ['Brasil', Validators.required]
    });
  }

  // Getter para facilitar o acesso ao array de endereços no HTML
  get addressControls() {
    return (this.form.get('address') as FormArray).controls;
  }

  // Método auxiliar centralizado de sucesso
  private finalizarSucesso() {
    this.form.reset();
    this.router.navigate(['/alunos']);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idAluno = Number(idParam);
      this.isEdicao = true;

      this.alunoService.buscarPorId(this.idAluno).subscribe({
        next: (aluno) => {
          // 1. Preenche os dados básicos do Aluno
          this.form.patchValue({
            name: aluno.name,
            phoneNumber: aluno.phoneNumber,
            emailAddress: aluno.emailAddress,
            studentNumber: aluno.studentNumber
          });

          // 1. Tenta pegar a lista de endereços tanto no singular quanto no plural para evitar erros
          const listaEnderecos = aluno.addresses || aluno.addresses;

          if (listaEnderecos && listaEnderecos.length > 0) {
            const addressArray = this.form.get('address') as FormArray;

            // Limpa o formulário de endereço padrão em branco
            addressArray.clear();

            // Injeta cada endereço vindo do banco criando um grupo na tela
            listaEnderecos.forEach((addr: any) => {
              const grupoEndereco = this.criarGrupoEndereco();
              grupoEndereco.patchValue(addr); // Distribui street, city, state, zipCode, id...
              addressArray.push(grupoEndereco);
            });
          }

        }
      });
    }
  }


  salvar(): void {
    if (this.form.valid) {
      const valoresForm = this.form.getRawValue();

      // Montamos o JSON exatamente com as chaves que o StudentRequest espera
      const payloadBackend = {
        name: valoresForm.name,
        phoneNumber: valoresForm.phoneNumber,
        emailAddress: valoresForm.emailAddress,
        studentNumber: valoresForm.studentNumber,
        photo: null,
        address: valoresForm.address
      };

      console.log('JSON enviado para o Java:', payloadBackend);

      if (this.isEdicao && this.idAluno) {
        this.alunoService.atualizar(this.idAluno, payloadBackend).subscribe({
          next: (resposta) => {
            console.log('Aluno atualizado com sucesso!', resposta);
            this.finalizarSucesso();
          },
          error: (err) => {
            console.error('O backend recusou a atualização:', err);
            alert('Erro ao atualizar aluno. Verifique os dados.');
          }
        });
      } else {
        this.alunoService.adicionar(payloadBackend as any).subscribe({
          next: (resposta) => {
            console.log('Salvo com sucesso no banco de dados!', resposta);
            this.finalizarSucesso();
          },
          error: (err) => {
            console.error('O backend recusou os dados. Verifique o console do Java.', err);
            alert('Erro ao salvar. Verifique se os dados estão corretos.');
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}