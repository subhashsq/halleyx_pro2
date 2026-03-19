import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildDateFilter } from './orders';

const router = Router();
const prisma = new PrismaClient();

const NUMERIC_FIELDS = ['quantity', 'unitPrice', 'totalAmount'];

const FIELD_MAP: Record<string, string> = {
  'Customer ID': 'customerId',
  'Customer name': 'customerName',
  'Email id': 'email',
  'Address': 'address',
  'Order date': 'orderDate',
  'Product': 'product',
  'Created by': 'createdBy',
  'Status': 'status',
  'Total amount': 'totalAmount',
  'Unit price': 'unitPrice',
  'Quantity': 'quantity',
  'Phone number': 'phone',
  'Order ID': 'orderId',
};

// POST /api/metrics — compute aggregation for a metric
router.post('/', async (req: Request, res: Response) => {
  try {
    const { metric, aggregation, dateFilter } = req.body;

    const dbField = FIELD_MAP[metric] || metric;
    const where = buildDateFilter(dateFilter || 'all');

    if (aggregation === 'Count') {
      const count = await prisma.customerOrder.count({ where });
      res.json({ value: count });
      return;
    }

    // Sum and Average only for numeric fields
    if (!NUMERIC_FIELDS.includes(dbField)) {
      // For non-numeric, just return count
      const count = await prisma.customerOrder.count({ where });
      res.json({ value: count });
      return;
    }

    const orders = await prisma.customerOrder.findMany({ where });

    if (orders.length === 0) {
      res.json({ value: 0 });
      return;
    }

    const values = orders.map((o: any) => Number(o[dbField]) || 0);
    const sum = values.reduce((a: number, b: number) => a + b, 0);

    if (aggregation === 'Sum') {
      res.json({ value: sum });
    } else if (aggregation === 'Average') {
      res.json({ value: sum / values.length });
    } else {
      res.json({ value: values.length });
    }
  } catch (error) {
    console.error('Error computing metrics:', error);
    res.status(500).json({ error: 'Failed to compute metrics' });
  }
});

export default router;
