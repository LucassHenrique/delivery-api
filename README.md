
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

---

# delivery-api

API backend para uma plataforma de delivery, construída com [NestJS](https://nestjs.com/) e [Prisma ORM](https://www.prisma.io/).  
Fornece endpoints para autenticação JWT, gerenciamento de usuários, produtos, pedidos, controle de status e mensageria com Redis.

---

## Funcionalidades principais

- Registro e login de usuários com JWT (autenticação e autorização)
- CRUD de produtos com controle de acesso via permissões administrativas
- Gerenciamento completo de pedidos: criação, atualização, status e associação de endereços
- Mensageria interna com Redis Pub/Sub para eventos de pedidos (ex: pedido criado, status alterado)
- Armazenamento de endereços de entrega associados a pedidos

---

## Tecnologias

- [NestJS](https://nestjs.com/) - framework Node.js para backend escalável
- [Prisma ORM](https://www.prisma.io/) - ORM para banco de dados MySQL
- [Redis](https://redis.io/) - sistema de mensageria via Pub/Sub
- [JWT](https://jwt.io/) - autenticação via tokens JSON Web Token
- TypeScript, class-validator e outras libs

---

## Requisitos

- Node.js >= 16
- MySQL rodando (com o schema configurado via Prisma)
- Redis rodando (localmente ou via container Docker)

---

## Setup e execução

1. Clone o repositório  
```bash
git clone https://github.com/LucassHenrique/delivery-api.git
cd delivery-api
```

2. Instale as dependências  
```bash
npm install
```

3. Configure as variáveis de ambiente  
Crie um arquivo `.env` com as variáveis necessárias, exemplo:  
```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
JWT_SECRET="sua_chave_secreta"
REDIS_URL="redis://localhost:6379"
```

4. Rode as migrations do Prisma para criar as tabelas no banco  
```bash
npx prisma migrate dev
```

5. Inicie o servidor (modo desenvolvimento)  
```bash
npm run start:dev
```

---

## Endpoints principais

- `POST /auth/signup` — cadastro de usuários
- `POST /auth/login` — login e obtenção do token JWT
- `POST /order` — criação de pedidos (autenticado)
- `GET /order` — listagem de pedidos (autenticado)
- `PATCH /order/:id/status` — atualizar status do pedido (autenticado)
- `POST /product` — criação de produtos (somente admin)
- `GET /order/status?status=PENDENTE` — filtrar pedidos por status
- entre outros

---

## Testes

Rode os testes unitários e e2e com os comandos:  
```bash
npm run test
npm run test:e2e
```

---

## Contribuição

Pull requests são bem-vindos!  
Por favor, abra issues para sugestões ou bugs.

---

## Licença

MIT License — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## Contato

- GitHub: [https://github.com/LucassHenrique](https://github.com/LucassHenrique)  
- LinkedIn: (https://www.linkedin.com/in/lucas-henrique-19630427b/)

---

## Recursos úteis

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [JWT Introduction](https://jwt.io/introduction/)
