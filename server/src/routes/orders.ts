import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Helper to build date filter
function buildDateFilter(dateFilter: string): object {
  const now = new Date();
  switch (dateFilter) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { orderDate: { gte: start } };
    }
    case '7days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return { orderDate: { gte: d } };
    }
    case '30days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return { orderDate: { gte: d } };
    }
    case '90days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 90);
      return { orderDate: { gte: d } };
    }
    default:
      return {};
  }
}

// GET /api/orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const dateFilter = (req.query.dateFilter as string) || 'all';
    const where = buildDateFilter(dateFilter);
    const orders = await prisma.customerOrder.findMany({
      where,
      orderBy: { orderDate: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      customerName,
      email,
      phone,
      address,
      orderId,
      orderDate,
      product,
      quantity,
      unitPrice,
      totalAmount,
      status,
      createdBy
    } = req.body;

    if (!customerId || !customerName || !email || !orderId || !orderDate || !product) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const order = await prisma.customerOrder.create({
      data: {
        customerId,
        customerName,
        email,
        phone: phone || '',
        address: address || '',
        orderId,
        orderDate: new Date(orderDate),
        product,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        totalAmount: Number(totalAmount),
        status: status || 'Pending',
        createdBy: createdBy || 'Admin',
      },
    });
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Order ID already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.customerOrder.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export { buildDateFilter };
export default router;
