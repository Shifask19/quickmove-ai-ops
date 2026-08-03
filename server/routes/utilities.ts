import { Router } from 'express';
import { db } from '../db.js';

export const utilitiesRouter = Router();

utilitiesRouter.get('/', (req, res) => {
  try {
    const { relocationId, status } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];

    if (relocationId) { conditions.push('relocation_id = ?'); params.push(relocationId); }
    if (status && status !== 'all') { conditions.push('status = ?'); params.push(status); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const stmt = db.prepare(`SELECT * FROM utilities ${where}`);
    const rows = params.length > 0 ? stmt.all(params) : stmt.all();

    res.json(rows);
  } catch (err: any) {
    console.error('GET /utilities error:', err.message);
    res.status(500).json({ error: 'Failed to fetch utilities' });
  }
});

utilitiesRouter.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM utilities WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { status, applicationDate, activationDate, accountNumber, notes } = req.body;

    db.prepare(`
      UPDATE utilities SET
        status           = ?,
        application_date = ?,
        activation_date  = ?,
        account_number   = ?,
        notes            = ?
      WHERE id = ?
    `).run(
      status          ?? existing.status,
      applicationDate ?? existing.application_date,
      activationDate  ?? existing.activation_date,
      accountNumber   ?? existing.account_number,
      notes           ?? existing.notes,
      req.params.id
    );

    res.json(db.prepare('SELECT * FROM utilities WHERE id = ?').get(req.params.id));
  } catch (err: any) {
    console.error('PUT /utilities/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update utility' });
  }
});
