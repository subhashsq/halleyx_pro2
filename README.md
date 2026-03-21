# ------------------------------
# Terminal 1 — Backend
# ------------------------------

cd server
npm install
npx prisma generate
npx prisma migrate dev --pro2 init
npx ts-node src/index.ts

# ------------------------------
# Terminal 2 — Frontend
# -------------------------------

cd client  , 
npm install  ,
npm run dev  

# ------------------------------
# DEPLOYMENT LINK
# -------------------------------

https://halleyx-pro2.vercel.app
