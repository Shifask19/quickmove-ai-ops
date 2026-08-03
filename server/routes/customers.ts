import { Router } from 'express';
import { db } from '../db.js';

export const customersRouter = Router();

// GET all customers
customersRouter.get('/', (req, res) => {
  try {
    const { search, type } = req.query;
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params: string[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type as string);
    }
    query += ' ORDER BY created_at DESC';

    const customers = db.prepare(query).all(...params);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET single customer
customersRouter.get('/:id', (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// POST create customer
customersRouter.post('/', (req, res) => {
  try {
    const { id, name, phone, email, type, corporateClientId, corporateClientName,
            assignedCoordinatorId, assignedCoordinatorName, notes } = req.body;

    if (!name || !phone || !email || !assignedCoordinatorId) {
      return res.status(400).json({ error: 'name, phone, email, assignedCoordinatorId are required' });
    }

    const newId = id || `c${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO customers (id, name, phone, email, type, corporate_client_id, corporate_client_name,
        assigned_coordinator_id, assigned_coordinator_name, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newId, name, phone, email, type || 'individual', corporateClientId || null,
      corporateClientName || null, assignedCoordinatorId, assignedCoordinatorName, notes || null, createdAt);

    const created = db.prepare('SELECT * FROM customers WHERE id = ?').get(newId);
    res.status(201).json(created);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT update customer
customersRouter.put('/:id', (req, res) => {
  try {
    const { name, phone, email, notes, assignedCoordinatorId, assignedCoordinatorName } = req.body;
    db.prepare(`
      UPDATE customers SET name=?, phone=?, email=?, notes=?,
        assigned_coordinator_id=?, assigned_coordinator_name=?
      WHERE id=?
    `).run(name, phone, email, notes, assignedCoordinatorId, assignedCoordinatorName, req.params.id);
    res.json(db.prepare('SELECT * FROM customers WHERE id=?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
customersRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id=?').run(req.params.id);
  res.json({ success: true });
});
