import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/dashboard — get the current dashboard config + widgets
router.get('/', async (_req: Request, res: Response) => {
  try {
    const dashboard = await prisma.dashboardConfig.findFirst({
      include: { widgets: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(dashboard || null);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// POST /api/dashboard — save/update entire dashboard
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, dateFilter, widgets } = req.body;

    // Use a transaction to replace the entire dashboard
    const result = await prisma.$transaction(async (tx) => {
      // Find existing dashboard
      let dashboard = await tx.dashboardConfig.findFirst();

      if (dashboard) {
        // Delete all existing widgets
        await tx.widget.deleteMany({ where: { dashboardId: dashboard.id } });

        // Update config
        dashboard = await tx.dashboardConfig.update({
          where: { id: dashboard.id },
          data: {
            name: name || 'My Dashboard',
            dateFilter: dateFilter || 'all',
          },
        });
      } else {
        // Create new dashboard
        dashboard = await tx.dashboardConfig.create({
          data: {
            name: name || 'My Dashboard',
            dateFilter: dateFilter || 'all',
          },
        });
      }

      // Create widgets
      if (widgets && widgets.length > 0) {
        await tx.widget.createMany({
          data: widgets.map((w: any) => ({
            dashboardId: dashboard!.id,
            type: w.type,
            title: w.title || 'Untitled',
            description: w.description || '',
            x: w.x ?? 0,
            y: w.y ?? 0,
            w: w.w ?? 4,
            h: w.h ?? 4,
            config: typeof w.config === 'string' ? w.config : JSON.stringify(w.config || {}),
          })),
        });
      }

      // Return full dashboard with widgets
      return tx.dashboardConfig.findUnique({
        where: { id: dashboard.id },
        include: { widgets: true },
      });
    });

    res.json(result);
  } catch (error) {
    console.error('Error saving dashboard:', error);
    res.status(500).json({ error: 'Failed to save dashboard' });
  }
});

export default router;
