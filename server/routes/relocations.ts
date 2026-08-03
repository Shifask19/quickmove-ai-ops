import { Router } from 'express';
import { db } from '../db.js';

export const relocationsRouter = Router();

function runQuery(sql: string, params: any[]) {
  const stmt = db.prepare(sql);
  return params.length > 0 ? stmt.all(params) : stmt.all();
}

function getStages(relocationId: string) {
  return db.prepare('SELECT * FROM relocation_stages WHERE relocation_id = ? ORDER BY id').all(relocationId);
}

function attachStages(relo: any) {
  return { ...relo, stages: getStages(relo.id) };
}

// GET all relocations
relocationsRouter.get('/', (req, res) => {
  try {
    const { status, priority, coordinator, search } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }
    if (priority && priority !== 'all') {
      conditions.push('priority = ?');
      params.push(priority);
    }
    if (coordinator && coordinator !== 'all') {
      conditions.push('assigned_coordinator_name = ?');
      params.push(coordinator);
    }
    if (search) {
      conditions.push('(customer_name LIKE ? OR from_city LIKE ? OR to_city LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT * FROM relocations ${where} ORDER BY created_at DESC`;

    const rows = runQuery(sql, params) as any[];
    res.json(rows.map(attachStages));
  } catch (err: any) {
    console.error('GET /relocations error:', err.message);
    res.status(500).json({ error: 'Failed to fetch relocations' });
  }
});

// GET single relocation
relocationsRouter.get('/:id', (req, res) => {
  try {
    const relo = db.prepare('SELECT * FROM relocations WHERE id = ?').get(req.params.id);
    if (!relo) return res.status(404).json({ error: 'Relocation not found' });
    res.json(attachStages(relo));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch relocation' });
  }
});

// GET relocation full detail
relocationsRouter.get('/:id/detail', (req, res) => {
  try {
    const relo = db.prepare('SELECT * FROM relocations WHERE id = ?').get(req.params.id) as any;
    if (!relo) return res.status(404).json({ error: 'Not found' });

    res.json({
      ...attachStages(relo),
      tasks:              db.prepare('SELECT * FROM tasks WHERE relocation_id = ?').all(req.params.id),
      properties:         db.prepare('SELECT * FROM properties WHERE relocation_id = ?').all(req.params.id),
      utilities:          db.prepare('SELECT * FROM utilities WHERE relocation_id = ?').all(req.params.id),
      documents:          db.prepare('SELECT * FROM documents WHERE relocation_id = ?').all(req.params.id),
      vendorBookings:     db.prepare('SELECT * FROM vendor_bookings WHERE relocation_id = ?').all(req.params.id),
      addressChangeItems: db.prepare('SELECT * FROM address_change_items WHERE relocation_id = ?').all(req.params.id),
      activityEvents:     db.prepare('SELECT * FROM activity_events WHERE relocation_id = ? ORDER BY timestamp DESC').all(req.params.id),
    });
  } catch (err: any) {
    console.error('GET /relocations/:id/detail error:', err.message);
    res.status(500).json({ error: 'Failed to fetch relocation detail' });
  }
});

// POST create relocation
relocationsRouter.post('/', (req, res) => {
  try {
    const {
      customerId, customerName, customerPhone, customerEmail,
      fromCity, fromAddress, toCity, toAddress, moveDate,
      status = 'inquiry', priority = 'medium', estimatedBudget,
      assignedCoordinatorId, assignedCoordinatorName, notes,
    } = req.body;

    if (!customerId || !fromCity || !toCity || !moveDate || !estimatedBudget) {
      return res.status(400).json({ error: 'customerId, fromCity, toCity, moveDate, estimatedBudget required' });
    }

    const id = `r${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO relocations (
        id, customer_id, customer_name, customer_phone, customer_email,
        from_city, from_address, to_city, to_address, move_date,
        status, priority, estimated_budget,
        assigned_coordinator_id, assigned_coordinator_name,
        notes, completion_percentage, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, customerId, customerName ?? '', customerPhone ?? '', customerEmail ?? '',
      fromCity, fromAddress ?? '', toCity, toAddress ?? '', moveDate,
      status, priority, Number(estimatedBudget),
      assignedCoordinatorId ?? '', assignedCoordinatorName ?? '',
      notes ?? null, 5, createdAt
    );

    // Insert default pipeline stages
    const stageTemplate = [
      ['inquiry','Inquiry'], ['onboarding','Onboarding'],
      ['property_search','Property Search'], ['property_finalized','Property Finalized'],
      ['move_planning','Move Planning'], ['packing_moving','Packing & Moving'],
      ['utility_setup','Utility Setup'], ['address_change','Address Change'],
      ['post_move_support','Post-Move Support'], ['completed','Completed'],
    ];
    const insertStage = db.prepare(`
      INSERT INTO relocation_stages (relocation_id, stage, label, status, started_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stageTemplate.forEach(([stage, label], idx) => {
      insertStage.run(id, stage, label, idx === 0 ? 'active' : 'pending', idx === 0 ? createdAt : null);
    });

    // Log activity
    db.prepare(`
      INSERT INTO activity_events (id, relocation_id, customer_name, action, description, performed_by, timestamp, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `ae${Date.now()}`, id, customerName ?? '',
      'Relocation Created', `New relocation: ${fromCity} → ${toCity}`,
      assignedCoordinatorName ?? 'System', new Date().toISOString(), 'stage_change'
    );

    const created = db.prepare('SELECT * FROM relocations WHERE id = ?').get(id);
    res.status(201).json(attachStages(created));
  } catch (err: any) {
    console.error('POST /relocations error:', err.message);
    res.status(500).json({ error: 'Failed to create relocation' });
  }
});

// PUT update relocation
relocationsRouter.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM relocations WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const {
      status, priority, moveDate, estimatedBudget, actualCost,
      toAddress, assignedCoordinatorId, assignedCoordinatorName,
      notes, completionPercentage,
    } = req.body;

    db.prepare(`
      UPDATE relocations SET
        status                    = ?,
        priority                  = ?,
        move_date                 = ?,
        estimated_budget          = ?,
        actual_cost               = ?,
        to_address                = ?,
        assigned_coordinator_id   = ?,
        assigned_coordinator_name = ?,
        notes                     = ?,
        completion_percentage     = ?
      WHERE id = ?
    `).run(
      status               ?? existing.status,
      priority             ?? existing.priority,
      moveDate             ?? existing.move_date,
      estimatedBudget      ?? existing.estimated_budget,
      actualCost           ?? existing.actual_cost,
      toAddress            ?? existing.to_address,
      assignedCoordinatorId   ?? existing.assigned_coordinator_id,
      assignedCoordinatorName ?? existing.assigned_coordinator_name,
      notes                ?? existing.notes,
      completionPercentage ?? existing.completion_percentage,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM relocations WHERE id = ?').get(req.params.id);
    res.json(attachStages(updated));
  } catch (err: any) {
    console.error('PUT /relocations error:', err.message);
    res.status(500).json({ error: 'Failed to update relocation' });
  }
});
