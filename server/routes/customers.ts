import { Router } from 'express';
import { db } from '../db.js';

export const customersRouter = Router();

function runQuery(sql: string, params: any[]) {
  const stmt = db.prepare(sql);
  return params.length > 0 ? stmt.all(params) : stmt.all();
}

// GET all customers
customersRouter.get('/', (req, res) => {
  try {
    const { search, type } = req.query;
    const conditions: string[] = [];
    const params: string[] = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (type && type !== 'all') {
      conditions.push('type = ?');
      params.push(type as string);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT * FROM customers ${where} ORDER BY created_at DESC`;

    res.json(runQuery(sql, params));
  } catch (err: any) {
    console.error('GET /customers error:', err.message);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET single customer
customersRouter.get('/:id', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST create customer
customersRouter.post('/', (req, res) => {
  try {
    const {
      id, name, phone, email, type,
      corporateClientId, corporateClientName,
      assignedCoordinatorId, assignedCoordinatorName, notes,
    } = req.body;

    if (!name || !phone || !email || !assignedCoordinatorId) {
      return res.status(400).json({ error: 'name, phone, email, assignedCoordinatorId are required' });
    }

    const newId = id || `c${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO customers (
        id, name, phone, email, type,
        corporate_client_id, corporate_client_name,
        assigned_coordinator_id, assigned_coordinator_name,
        notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newId, name, phone, email, type || 'individual',
      corporateClientId || null, corporateClientName || null,
      assignedCoordinatorId, assignedCoordinatorName || '',
      notes || null, createdAt
    );

    res.status(201).json(db.prepare('SELECT * FROM customers WHERE id = ?').get(newId));
  } catch (err: any) {
    console.error('POST /customers error:', err.message);
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT update customer
customersRouter.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { name, phone, email, notes, assignedCoordinatorId, assignedCoordinatorName } = req.body;

    db.prepare(`
      UPDATE customers SET
        name = ?, phone = ?, email = ?, notes = ?,
        assigned_coordinator_id = ?, assigned_coordinator_name = ?
      WHERE id = ?
    `).run(
      name ?? existing.name,
      phone ?? existing.phone,
      email ?? existing.email,
      notes ?? existing.notes,
      assignedCoordinatorId ?? existing.assigned_coordinator_id,
      assignedCoordinatorName ?? existing.assigned_coordinator_name,
      req.params.id
    );

    res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id));
  } catch (err: any) {
    console.error('PUT /customers error:', err.message);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
customersRouter.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});
