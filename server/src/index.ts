import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import ordersRouter from './routes/orders';
import dashboardRouter from './routes/dashboard';
import metricsRouter from './routes/metrics';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/metrics', metricsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };
export default app;
