import { Router } from 'express';
import { db } from '../db.js';

export const relocationsRouter = Router();

function getStages(relocationId: string) {
  return db.prepare('SELECT * FROM relocation_stages WHERE relocation_id = ? ORDER BY id').all(relocationId);
}

function attachStages(relo: any) {
  const stages = getStages(relo.id);
  return { ...relo, stages };
}

// GET all relocations
relocationsRouter.get('/', (req, res) => {
  try {
    const { status, priority, coordinator, search } = req.query;
    let query = 'SELECT * FROM relocations WHERE 1=1';
    const params: string[] = [];

    if (status && status !== 'all') { query += ' AND status=?'; params.push(status as string); }
    if (priority && priority !== 'all') { query += ' AND priority=?'; params.push(priority as string); }
    if (coordinator && coordinator !== 'all') { query += ' AND assigned_coordinator_name=?'; params.push(coordinator as string); }
    if (search) {
      query += ' AND (customer_name LIKE ? OR from_city LIKE ? OR to_city LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);
    res.json(rows.map(attachStages));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch relocations' });
  }
});

// GET single relocation with all related data
relocationsRouter.get('/:id', (req, res) => {
  const relo = db.prepare('SELECT * FROM relocations WHERE id=?').get(req.params.id);
  if (!relo) return res.status(404).json({ error: 'Relocation not found' });
  res.json(attachStages(relo));
});

// GET relocation full detail (all related entities)
relocationsRouter.get('/:id/detail', (req, res) => {
  const relo = db.prepare('SELECT * FROM relocations WHERE id=?').get(req.params.id) as any;
  if (!relo) return res.status(404).json({ error: 'Not found' });

  res.json({
    ...attachStages(relo),
    tasks:              db.prepare('SELECT * FROM tasks WHERE relocation_id=?').all(req.params.id),
    properties:         db.prepare('SELECT * FROM properties WHERE relocation_id=?').all(req.params.id),
    utilities:          db.prepare('SELECT * FROM utilities WHERE relocation_id=?').all(req.params.id),
    documents:          db.prepare('SELECT * FROM documents WHERE relocation_id=?').all(req.params.id),
    vendorBookings:     db.prepare('SELECT * FROM vendor_bookings WHERE relocation_id=?').all(req.params.id),
    addressChangeItems: db.prepare('SELECT * FROM address_change_items WHERE relocation_id=?').all(req.params.id),
    activityEvents:     db.prepare('SELECT * FROM activity_events WHERE relocation_id=? ORDER BY timestamp DESC').all(req.params.id),
  });
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
      return res.status(400).json({ error: 'customerId, fromCity, toCity, moveDate, estimatedBudget are required' });
    }

    const id = `r${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO relocations (id, customer_id, customer_name, customer_phone, customer_email,
        from_city, from_address, to_city, to_address, move_date, status, priority,
        estimated_budget, assigned_coordinator_id, assigned_coordinator_name,
        notes, completion_percentage, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, customerId, customerName, customerPhone, customerEmail,
      fromCity, fromAddress || '', toCity, toAddress || '', moveDate,
      status, priority, estimatedBudget, assignedCoordinatorId,
      assignedCoordinatorName, notes || null, 5, createdAt);

    // Insert default stages
    const stageTemplate = [
      ['inquiry','Inquiry'],['onboarding','Onboarding'],['property_search','Property Search'],
      ['property_finalized','Property Finalized'],['move_planning','Move Planning'],
      ['packing_moving','Packing & Moving'],['utility_setup','Utility Setup'],
      ['address_change','Address Change'],['post_move_support','Post-Move Support'],['completed','Completed'],
    ];

    const insertStage = db.prepare(`
      INSERT INTO relocation_stages (relocation_id, stage, label, status, started_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stageTemplate.forEach(([stage, label], idx) => {
      insertStage.run(id, stage, label, idx === 0 ? 'active' : 'pending', idx === 0 ? createdAt : null);
    });

    // Log activity
    db.prepare(`INSERT INTO activity_events (id, relocation_id, customer_name, action, description, performed_by, timestamp, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(`ae${Date.now()}`, id, customerName, 'Relocation Created', `New relocation: ${fromCity} → ${toCity}`, assignedCoordinatorName, new Date().toISOString(), 'stage_change');

    const created = db.prepare('SELECT * FROM relocations WHERE id=?').get(id);
    res.status(201).json(attachStages(created));
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create relocation' });
  }
});

// PUT update relocation
relocationsRouter.put('/:id', (req, res) => {
  try {
    const { status, priority, moveDate, estimatedBudget, actualCost,
            toAddress, assignedCoordinatorId, assignedCoordinatorName,
            notes, completionPercentage } = req.body;

    db.prepare(`
      UPDATE relocations SET
        status=COALESCE(?,status), priority=COALESCE(?,priority),
        move_date=COALESCE(?,move_date), estimated_budget=COALESCE(?,estimated_budget),
        actual_cost=COALESCE(?,actual_cost), to_address=COALESCE(?,to_address),
        assigned_coordinator_id=COALESCE(?,assigned_coordinator_id),
        assigned_coordinator_name=COALESCE(?,assigned_coordinator_name),
        notes=COALESCE(?,notes), completion_percentage=COALESCE(?,completion_percentage)
      WHERE id=?
    `).run(status, priority, moveDate, estimatedBudget, actualCost,
      toAddress, assignedCoordinatorId, assignedCoordinatorName,
      notes, completionPercentage, req.params.id);

    const updated = db.prepare('SELECT * FROM relocations WHERE id=?').get(req.params.id);
    res.json(attachStages(updated));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update relocation' });
  }
});
