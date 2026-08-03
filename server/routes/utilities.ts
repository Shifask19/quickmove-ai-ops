import { Router } from 'express';
import { db } from '../db.js';

export const utilitiesRouter = Router();

utilitiesRouter.get('/', (req, res) => {
  const { relocationId, status } = req.query;
  let query = 'SELECT * FROM utilities WHERE 1=1';
  const params: string[] = [];
  if (relocationId) { query += ' AND relocation_id=?'; params.push(relocationId as string); }
  if (status && status !== 'all') { query += ' AND status=?'; params.push(status as string); }
  res.json(db.prepare(query).all(...params));
});

utilitiesRouter.put('/:id', (req, res) => {
  try {
    const { status, applicationDate, activationDate, accountNumber, notes } = req.body;
    db.prepare(`
      UPDATE utilities SET
        status=COALESCE(?,status),
        application_date=COALESCE(?,application_date),
        activation_date=COALESCE(?,activation_date),
        account_number=COALESCE(?,account_number),
        notes=COALESCE(?,notes)
      WHERE id=?
    `).run(status, applicationDate, activationDate, accountNumber, notes, req.params.id);
    res.json(db.prepare('SELECT * FROM utilities WHERE id=?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update utility' });
  }
});
