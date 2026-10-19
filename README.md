# 🏫 Bom Jesus App — Frontend

Aplicação web para o gerenciamento acadêmico de **alunos** e **professores**. Foi desenvolvida com as práticas mais recentes do Angular, com foco em reatividade, boa performance e carregamento sob demanda (*lazy loading*).

## 🚀 Tecnologias Utilizadas

- **Angular 19+** — componentes standalone e injeção de dependência via `inject()`
- **TypeScript** — modo estrito para tipagem segura
- **Angular Signals** — gerenciamento de estado e reatividade
- **Bootstrap 5** — layout responsivo e validações visuais
- **RxJS** — fluxos assíncronos e chamadas HTTP

## 🛠️ Arquitetura e Recursos

- **Formulários reativos:** uso do `FormBuilder` com validações em tempo real.
- **`FormArray` dinâmico:** cadastro e edição de múltiplos endereços na mesma tela.
- **Mapeamento de payload:** interfaces TypeScript alinhadas aos `Records`/DTOs do Spring Boot, convertendo os campos do formulário (em português) para as chaves em inglês exigidas pelo backend.
- **Exclusão lógica (*soft delete*):** a remoção de alunos e professores dispara uma requisição `DELETE` e atualiza o status do registro localmente para `DISABLE` via Signals, sem recarregar a página e sem apagar o histórico do banco.
- **Lazy loading:** rotas que carregam os componentes sob demanda, reduzindo o tamanho do pacote inicial.

## 📂 Estrutura do Projeto

```text
src/app/
├── components/
│   ├── alunos/               # Listagem de alunos com controle de status
│   ├── cadastro-aluno/       # Formulário de cadastro/edição de alunos
│   ├── professores/          # Listagem de professores
│   ├── cadastro-professor/   # Formulário com FormArray de endereços
│   └── side-bar/             # Barra de navegação lateral
├── models/
│   ├── student-response.ts   # Mapeamento do DTO de alunos
│   ├── teacher-response.ts   # Mapeamento do DTO de professores
│   └── status.enum.ts        # Estados do registro (ACTIVE, DISABLE, PENDING)
├── services/
│   ├── alunos.ts             # Consumo da API de alunos
│   └── professor-service.ts  # Consumo da API de professores
├── app.routes.ts             # Rotas da aplicação (lazy loading)
├── app.html                  # Layout principal com <router-outlet />
└── app.ts                    # Componente raiz standalone
```

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) 22 ou superior
- Angular CLI:

```bash
npm install -g @angular/cli
```

## ▶️ Como Executar

1. Clone o repositório e entre na pasta do projeto:

```bash
git clone <url-do-repositorio>
cd bom-jesus-app
```

2. Instale as dependências:

```bash
npm install
```

3. Suba o servidor de desenvolvimento:

```bash
ng serve
```

A aplicação ficará disponível em `http://localhost:4200`. A página inicial é a listagem de alunos.

## 📦 Build de Produção

```bash
ng build
```

Os arquivos gerados ficam em `dist/`.

## 🌐 Integração com o Backend

O frontend consome a API REST em Spring Boot que roda em `http://localhost:8080`. Para o funcionamento correto:

- O backend deve estar em execução antes de abrir a aplicação.
- O **CORS** precisa liberar a origem `http://localhost:4200` e os métodos `GET`, `POST`, `PUT` e `DELETE`.
- As interfaces em `models/` devem refletir os DTOs retornados pela API. Se o contrato mudar no backend, ajuste-as aqui.

## 👤 Autor

**Tharlis Sampaio Seixas**