import { Router } from 'express';
import { db } from '../db.js';

export const tasksRouter = Router();

// GET all tasks
tasksRouter.get('/', (req, res) => {
  const { status, priority, assignee, relocationId } = req.query;
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params: string[] = [];

  if (status && status !== 'all')   { query += ' AND status=?';                params.push(status as string); }
  if (priority && priority !== 'all'){ query += ' AND priority=?';             params.push(priority as string); }
  if (assignee && assignee !== 'all'){ query += ' AND assigned_to_name=?';     params.push(assignee as string); }
  if (relocationId)                  { query += ' AND relocation_id=?';        params.push(relocationId as string); }
  query += ' ORDER BY CASE status WHEN "overdue" THEN 0 WHEN "in_progress" THEN 1 WHEN "pending" THEN 2 ELSE 3 END, due_date ASC';

  res.json(db.prepare(query).all(...params));
});

// POST create task
tasksRouter.post('/', (req, res) => {
  try {
    const { relocationId, customerName, title, description,
            assignedToId, assignedToName, dueDate, priority = 'medium' } = req.body;

    if (!relocationId || !title || !dueDate) {
      return res.status(400).json({ error: 'relocationId, title, dueDate required' });
    }

    const id = `t${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const isOverdue = new Date(dueDate) < new Date();
    const status = isOverdue ? 'overdue' : 'pending';

    db.prepare(`
      INSERT INTO tasks (id, relocation_id, customer_name, title, description,
        assigned_to_id, assigned_to_name, due_date, status, priority, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, relocationId, customerName, title, description || null,
      assignedToId, assignedToName, dueDate, status, priority, createdAt);

    res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id=?').get(id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
tasksRouter.put('/:id', (req, res) => {
  try {
    const { status, priority, assignedToId, assignedToName, dueDate, completedAt } = req.body;
    const finished = status === 'completed' ? (completedAt || new Date().toISOString().split('T')[0]) : null;

    db.prepare(`
      UPDATE tasks SET
        status=COALESCE(?,status), priority=COALESCE(?,priority),
        assigned_to_id=COALESCE(?,assigned_to_id), assigned_to_name=COALESCE(?,assigned_to_name),
        due_date=COALESCE(?,due_date), completed_at=?
      WHERE id=?
    `).run(status, priority, assignedToId, assignedToName, dueDate, finished, req.params.id);

    res.json(db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
tasksRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id=?').run(req.params.id);
  res.json({ success: true });
});
