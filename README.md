# users-api-ts

Projet TypeScript (Express + Prisma) refactoré pour répondre aux exigences :

- Architecture N-layer (Controller → Service → Repository)
- Interfaces (`IUserService`, `IUserRepository`) et DTOs
- Injection de dépendances via Awilix (container)
- Assignation automatique du rôle : emails `@company.com` → `ADMIN`, sinon `USER`
- CRUD complet (soft delete)
- Validation des entrées avec `express-validator`

Usage (local):
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
