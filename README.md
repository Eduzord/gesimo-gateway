# GesImo - API Gateway

O **GesImo Gateway** é o Ponto Único de Entrada (*Single Point of Entry*) para a plataforma GesImo. Sua principal responsabilidade é centralizar a comunicação do front-end com os microsserviços do backend, garantindo segurança, roteamento transparente e controle de acesso integrado.

## 🚀 Funcionalidades
- **Roteamento Centralizado:** Encaminha requisições de forma transparente para os microsserviços (Imóveis, Locador, Locatários, Agendamentos, etc).
- **Segurança (Zero Trust):** Intercepta requisições protegidas através de um `JwtMiddleware`. Valida não apenas a assinatura criptográfica do JWT, mas também consulta a `auth-api` em tempo real para barrar tokens de usuários que foram desativados (`status != 1`).
- **Suporte a Uploads:** Trata dados do tipo `multipart/form-data` utilizando a biblioteca `form-data` e o Axios para encaminhar o upload de arquivos físicos (como contratos em PDF) perfeitamente aos microsserviços.
- **Documentação:** Consolida todas as rotas de API em uma interface Swagger acessível em um único lugar.

## 🛠 Stacks Utilizadas
- **[NestJS](https://nestjs.com/)**: Framework estrutural focado em injeção de dependência e arquitetura escalável (SOLID).
- **[Axios](https://axios-http.com/) / `@nestjs/axios`**: Cliente HTTP robusto utilizado internamente pelo Gateway para rotear requisições.
- **[JSON Web Token (JWT)](https://jwt.io/)**: Padrão de segurança utilizado para validar o acesso às rotas restritas.
- **[Swagger / OpenAPI](https://swagger.io/)**: Documentação viva da API.

## ⚙️ Instruções para Rodar Localmente

1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. Navegue até a pasta do `gesimo-gateway`:
   ```bash
   cd gesimo-gateway
   ```
3. Instale as dependências do projeto:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` na raiz do gateway e defina as variáveis necessárias. Por exemplo:
   ```env
   PORT=4000
   JWT_SECRET="sua_chave_secreta_compartilhada_com_a_auth_api"
   AUTH_MICROSERVICE_URL="http://localhost:3000"
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
6. O Gateway estará rodando em `http://localhost:4000`. 
   > Você pode acessar a documentação do Swagger em `http://localhost:4000/api/docs`.
