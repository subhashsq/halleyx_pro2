### Backend Setup

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --pro2 init
npx ts-node src/index.ts
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Deployment Link

https://halleyx-pro2.vercel.app
