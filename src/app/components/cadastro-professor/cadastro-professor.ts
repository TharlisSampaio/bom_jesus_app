import { Component, inject, OnInit } from '@angular/core';
import { Professor } from '../../models/professor';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessorService } from '../../services/professor-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-cadastro-professor',
  styleUrl: './cadastro-professor.css',
  templateUrl: './cadastro-professor.html',
})

export class CadastroProfessor implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private professoresService = inject(ProfessorService);
  private router = inject(Router);

  idProfessor: number | null = null;
  isEdicao = false;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phoneNumber: ['', [Validators.required]],
    emailAddress: ['', [Validators.required, Validators.email]],
    salary: [0, [Validators.required, Validators.min(0)]],
    address: this.fb.array([this.criarGrupoEndereco()])
  });

  private finalizarSucesso() {
    this.form.reset();
    this.router.navigate(['/professores']);
  }

  get addressControls() {
    return (this.form.get('address') as FormArray).controls;
  }

  adicionarEndereco(): void {
    const array = this.form.get('address') as FormArray;
    array.push(this.criarGrupoEndereco());
  }

  removerEndereco(index: number): void {
    const array = this.form.get('address') as FormArray;
    array.removeAt(index);
  }

  // 1. Adicione o id (opcional) na estrutura do grupo de endereço
  private criarGrupoEndereco() {
    return this.fb.group({
      id: [null as number | null], // Controla o ID do endereço na alteração do Hibernate
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      zipCode: ['', Validators.required],
      country: ['Brasil', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idProfessor = Number(idParam);
      this.isEdicao = true;

      this.professoresService.buscarPorId(this.idProfessor).subscribe({
        next: (professor: any) => { // Alterado para any temporário para aceitar checagem de chaves
          // 1. Injeta os dados básicos do Professor
          this.form.patchValue({
            name: professor.name,
            phoneNumber: professor.phoneNumber,
            emailAddress: professor.emailAddress,
            salary: professor.salary
          });

          // 2. CORREÇÃO: Captura a lista independente de estar no singular ou plural
          const listaEnderecos = professor.address || professor.addresses;

          if (listaEnderecos && listaEnderecos.length > 0) {
            const addressArray = this.form.get('address') as FormArray;

            // Limpa o bloco em branco inicial do formulário
            addressArray.clear();

            // Varre os endereços do banco, cria os grupos e faz o patchValue individual
            listaEnderecos.forEach((addr: any) => {
              const grupoEndereco = this.criarGrupoEndereco();
              grupoEndereco.patchValue(addr); // Distribui os dados nos inputs
              addressArray.push(grupoEndereco); // Desenha o bloco no HTML
            });
          }
        },
        error: (err) => console.error('Erro ao buscar dados do professor:', err)
      });
    }
  }

  salvar(): void {
    if (this.form.valid) {
      const valoresForm = this.form.getRawValue();

      const payloadBackend = {
        name: valoresForm.name,
        phoneNumber: valoresForm.phoneNumber,
        emailAddress: valoresForm.emailAddress,
        salary: valoresForm.salary,
        status: 'ACTIVE',
        address: valoresForm.address
      };

      console.log('JSON pronto para enviar ao backend:', payloadBackend);

      if (this.isEdicao && this.idProfessor) {
        this.professoresService.atualizar(this.idProfessor, payloadBackend).subscribe({
          next: (resposta: Professor) => {
            console.log('Professor atualizado com sucesso!', resposta);
            this.finalizarSucesso(); // 🌟 Chamando o nome correto do método
          },
          error: (err) => {
            console.error('O backend rejeitou a atualização:', err);
            alert('Erro ao atualizar professor. Verifique os dados.');
          }
        });
      } else {
        this.professoresService.adicionar(payloadBackend as any).subscribe({
          next: (resposta: Professor) => {
            console.log('Professor saved successfully!', resposta);
            this.finalizarSucesso(); // 🌟 Chamando o nome correto do método
          },
          error: (err) => {
            console.error('O backend rejeitou a requisição:', err);
            alert('Erro ao salvar professor. Verifique os dados.');
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}