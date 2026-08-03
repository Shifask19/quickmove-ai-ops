import { Router } from 'express';
import { db } from '../db.js';

export const miscRouter = Router();

function runQuery(sql: string, params: any[]) {
  const stmt = db.prepare(sql);
  return params.length > 0 ? stmt.all(params) : stmt.all();
}

// ─── Team Members ─────────────────────────────────────────────────────────────
miscRouter.get('/team', (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM team_members').all());
  } catch (err: any) {
    console.error('GET /team error:', err.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// ─── Corporate Clients ────────────────────────────────────────────────────────
miscRouter.get('/corporate-clients', (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM corporate_clients').all());
  } catch (err: any) {
    console.error('GET /corporate-clients error:', err.message);
    res.status(500).json({ error: 'Failed to fetch corporate clients' });
  }
});

// ─── Properties ───────────────────────────────────────────────────────────────
miscRouter.get('/properties', (req, res) => {
  try {
    const { relocationId, status } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];

    if (relocationId) { conditions.push('relocation_id = ?'); params.push(relocationId); }
    if (status && status !== 'all') { conditions.push('status = ?'); params.push(status); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    res.json(runQuery(`SELECT * FROM properties ${where} ORDER BY created_at DESC`, params));
  } catch (err: any) {
    console.error('GET /properties error:', err.message);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

miscRouter.post('/properties', (req, res) => {
  try {
    const { relocationId, address, city, rent, bedrooms, bathrooms, area,
            status, brokerName, brokerPhone, visitDate, notes } = req.body;
    const id = `p${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO properties (
        id, relocation_id, address, city, rent,
        bedrooms, bathrooms, area, status,
        broker_name, broker_phone, visit_date, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, relocationId, address, city, Number(rent),
      bedrooms ?? 2, bathrooms ?? 1, area ?? null,
      status ?? 'shortlisted', brokerName ?? null, brokerPhone ?? null,
      visitDate ?? null, notes ?? null, createdAt
    );

    res.status(201).json(db.prepare('SELECT * FROM properties WHERE id = ?').get(id));
  } catch (err: any) {
    console.error('POST /properties error:', err.message);
    res.status(500).json({ error: 'Failed to add property' });
  }
});

miscRouter.put('/properties/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const { status, visitDate, notes } = req.body;
    db.prepare('UPDATE properties SET status = ?, visit_date = ?, notes = ? WHERE id = ?')
      .run(status ?? existing.status, visitDate ?? existing.visit_date, notes ?? existing.notes, req.params.id);
    res.json(db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// ─── Notifications ────────────────────────────────────────────────────────────
miscRouter.get('/notifications', (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM notifications ORDER BY created_at DESC').all());
  } catch (err: any) {
    console.error('GET /notifications error:', err.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

miscRouter.put('/notifications/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notification read' });
  }
});

miscRouter.put('/notifications/read-all', (_req, res) => {
  try {
    db.prepare('UPDATE notifications SET read = 1').run();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark all read' });
  }
});

// ─── Address Change ───────────────────────────────────────────────────────────
miscRouter.get('/address-change', (req, res) => {
  try {
    const { relocationId } = req.query;
    if (relocationId) {
      res.json(db.prepare('SELECT * FROM address_change_items WHERE relocation_id = ?').all(relocationId as string));
    } else {
      res.json(db.prepare('SELECT * FROM address_change_items').all());
    }
  } catch (err: any) {
    console.error('GET /address-change error:', err.message);
    res.status(500).json({ error: 'Failed to fetch address change items' });
  }
});

miscRouter.put('/address-change/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM address_change_items WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const { status, submittedDate, completedDate, notes } = req.body;
    db.prepare(`
      UPDATE address_change_items SET
        status = ?, submitted_date = ?, completed_date = ?, notes = ?
      WHERE id = ?
    `).run(
      status ?? existing.status,
      submittedDate ?? existing.submitted_date,
      completedDate ?? existing.completed_date,
      notes ?? existing.notes,
      req.params.id
    );
    res.json(db.prepare('SELECT * FROM address_change_items WHERE id = ?').get(req.params.id));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update address change item' });
  }
});

// ─── Documents ────────────────────────────────────────────────────────────────
miscRouter.get('/documents', (req, res) => {
  try {
    const { relocationId } = req.query;
    if (relocationId) {
      res.json(db.prepare('SELECT * FROM documents WHERE relocation_id = ?').all(relocationId as string));
    } else {
      res.json(db.prepare('SELECT * FROM documents').all());
    }
  } catch (err: any) {
    console.error('GET /documents error:', err.message);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// ─── Activity ─────────────────────────────────────────────────────────────────
miscRouter.get('/activity', (req, res) => {
  try {
    const { relocationId, type } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];

    if (relocationId) { conditions.push('relocation_id = ?'); params.push(relocationId); }
    if (type && type !== 'all') { conditions.push('type = ?'); params.push(type); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    res.json(runQuery(`SELECT * FROM activity_events ${where} ORDER BY timestamp DESC`, params));
  } catch (err: any) {
    console.error('GET /activity error:', err.message);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// ─── Dashboard Summary ────────────────────────────────────────────────────────
miscRouter.get('/dashboard', (_req, res) => {
  try {
    const today    = new Date().toISOString().split('T')[0];
    const in14days = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const in7days  = new Date(Date.now() +  7 * 86400000).toISOString().split('T')[0];

    const q = (sql: string, ...p: any[]) =>
      (db.prepare(sql).get(...p) as any).c as number;

    const active         = q(`SELECT COUNT(*) as c FROM relocations WHERE status NOT IN ('completed','cancelled')`);
    const delayed        = q(`SELECT COUNT(*) as c FROM relocations WHERE move_date <= ? AND move_date >= ? AND status NOT IN ('completed','cancelled','packing_moving')`, in7days, today);
    const pendingTasks   = q(`SELECT COUNT(*) as c FROM tasks WHERE status != 'completed'`);
    const upcomingMoves  = q(`SELECT COUNT(*) as c FROM relocations WHERE move_date BETWEEN ? AND ? AND status NOT IN ('completed','cancelled')`, today, in14days);
    const highPriority   = q(`SELECT COUNT(*) as c FROM relocations WHERE priority IN ('high','urgent') AND status NOT IN ('completed','cancelled')`);
    const overdueTaskCount = q(`SELECT COUNT(*) as c FROM tasks WHERE status = 'overdue'`);
    const missingDocuments = q(`SELECT COUNT(*) as c FROM documents WHERE uploaded_at IS NULL AND required = 1`);
    const totalCustomers = q(`SELECT COUNT(*) as c FROM customers`);

    res.json({ active, delayed, pendingTasks, upcomingMoves, highPriority, overdueTaskCount, missingDocuments, totalCustomers });
  } catch (err: any) {
    console.error('GET /dashboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});
