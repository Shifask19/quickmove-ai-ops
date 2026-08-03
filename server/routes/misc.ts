import { Router } from 'express';
import { db } from '../db.js';

export const miscRouter = Router();

// ─── Team Members ─────────────────────────────────────────────────────────────
miscRouter.get('/team', (_req, res) => {
  res.json(db.prepare('SELECT * FROM team_members').all());
});

// ─── Corporate Clients ────────────────────────────────────────────────────────
miscRouter.get('/corporate-clients', (_req, res) => {
  res.json(db.prepare('SELECT * FROM corporate_clients').all());
});

// ─── Properties ───────────────────────────────────────────────────────────────
miscRouter.get('/properties', (req, res) => {
  const { relocationId, status } = req.query;
  let q = 'SELECT * FROM properties WHERE 1=1';
  const p: string[] = [];
  if (relocationId) { q += ' AND relocation_id=?'; p.push(relocationId as string); }
  if (status && status !== 'all') { q += ' AND status=?'; p.push(status as string); }
  res.json(db.prepare(q).all(...p));
});

miscRouter.post('/properties', (req, res) => {
  try {
    const { relocationId, address, city, rent, bedrooms, bathrooms, area, status,
            brokerName, brokerPhone, visitDate, notes } = req.body;
    const id = `p${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT INTO properties (id, relocation_id, address, city, rent, bedrooms, bathrooms, area,
        status, broker_name, broker_phone, visit_date, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, relocationId, address, city, rent, bedrooms || 2, bathrooms || 1, area || null,
      status || 'shortlisted', brokerName || null, brokerPhone || null, visitDate || null, notes || null, createdAt);
    res.status(201).json(db.prepare('SELECT * FROM properties WHERE id=?').get(id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add property' });
  }
});

miscRouter.put('/properties/:id', (req, res) => {
  const { status, visitDate, notes } = req.body;
  db.prepare('UPDATE properties SET status=COALESCE(?,status), visit_date=COALESCE(?,visit_date), notes=COALESCE(?,notes) WHERE id=?')
    .run(status, visitDate, notes, req.params.id);
  res.json(db.prepare('SELECT * FROM properties WHERE id=?').get(req.params.id));
});

// ─── Notifications ────────────────────────────────────────────────────────────
miscRouter.get('/notifications', (_req, res) => {
  res.json(db.prepare('SELECT * FROM notifications ORDER BY created_at DESC').all());
});

miscRouter.put('/notifications/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET read=1 WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

miscRouter.put('/notifications/read-all', (_req, res) => {
  db.prepare('UPDATE notifications SET read=1').run();
  res.json({ success: true });
});

// ─── Address Change ───────────────────────────────────────────────────────────
miscRouter.get('/address-change', (req, res) => {
  const { relocationId } = req.query;
  let q = 'SELECT * FROM address_change_items WHERE 1=1';
  const p: string[] = [];
  if (relocationId) { q += ' AND relocation_id=?'; p.push(relocationId as string); }
  res.json(db.prepare(q).all(...p));
});

miscRouter.put('/address-change/:id', (req, res) => {
  const { status, submittedDate, completedDate, notes } = req.body;
  db.prepare(`
    UPDATE address_change_items SET
      status=COALESCE(?,status),
      submitted_date=COALESCE(?,submitted_date),
      completed_date=COALESCE(?,completed_date),
      notes=COALESCE(?,notes)
    WHERE id=?
  `).run(status, submittedDate, completedDate, notes, req.params.id);
  res.json(db.prepare('SELECT * FROM address_change_items WHERE id=?').get(req.params.id));
});

// ─── Documents ────────────────────────────────────────────────────────────────
miscRouter.get('/documents', (req, res) => {
  const { relocationId } = req.query;
  const q = relocationId
    ? 'SELECT * FROM documents WHERE relocation_id=?'
    : 'SELECT * FROM documents';
  res.json(relocationId ? db.prepare(q).all(relocationId) : db.prepare(q).all());
});

// ─── Activity ─────────────────────────────────────────────────────────────────
miscRouter.get('/activity', (req, res) => {
  const { relocationId, type } = req.query;
  let q = 'SELECT * FROM activity_events WHERE 1=1';
  const p: string[] = [];
  if (relocationId) { q += ' AND relocation_id=?'; p.push(relocationId as string); }
  if (type && type !== 'all') { q += ' AND type=?'; p.push(type as string); }
  q += ' ORDER BY timestamp DESC';
  res.json(db.prepare(q).all(...p));
});

// ─── Dashboard Summary ────────────────────────────────────────────────────────
miscRouter.get('/dashboard', (_req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const in14days = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
  const in7days  = new Date(Date.now() +  7 * 86400000).toISOString().split('T')[0];

  const active = (db.prepare(`SELECT COUNT(*) as c FROM relocations WHERE status NOT IN ('completed','cancelled')`).get() as any).c;
  const delayed = (db.prepare(`SELECT COUNT(*) as c FROM relocations WHERE move_date <= ? AND move_date >= ? AND status NOT IN ('completed','cancelled','packing_moving')`).get(in7days, today) as any).c;
  const pendingTasks = (db.prepare(`SELECT COUNT(*) as c FROM tasks WHERE status != 'completed'`).get() as any).c;
  const upcomingMoves = (db.prepare(`SELECT COUNT(*) as c FROM relocations WHERE move_date BETWEEN ? AND ? AND status NOT IN ('completed','cancelled')`).get(today, in14days) as any).c;
  const highPriority = (db.prepare(`SELECT COUNT(*) as c FROM relocations WHERE priority IN ('high','urgent') AND status NOT IN ('completed','cancelled')`).get() as any).c;
  const overdueTaskCount = (db.prepare(`SELECT COUNT(*) as c FROM tasks WHERE status='overdue'`).get() as any).c;
  const missingDocuments = (db.prepare(`SELECT COUNT(*) as c FROM documents WHERE uploaded_at IS NULL AND required=1`).get() as any).c;
  const totalCustomers = (db.prepare(`SELECT COUNT(*) as c FROM customers`).get() as any).c;

  res.json({ active, delayed, pendingTasks, upcomingMoves, highPriority, overdueTaskCount, missingDocuments, totalCustomers });
});
