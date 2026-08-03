import { Router } from 'express';
import { db } from '../db.js';

export const tasksRouter = Router();

// GET all tasks
tasksRouter.get('/', (req, res) => {
  try {
    const { status, priority, assignee, relocationId } = req.query;
    const conditions: string[] = [];
    const params: string[] = [];

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status as string);
    }
    if (priority && priority !== 'all') {
      conditions.push('priority = ?');
      params.push(priority as string);
    }
    if (assignee && assignee !== 'all') {
      conditions.push('assigned_to_name = ?');
      params.push(assignee as string);
    }
    if (relocationId) {
      conditions.push('relocation_id = ?');
      params.push(relocationId as string);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT * FROM tasks ${where} ORDER BY due_date ASC`;

    const rows = params.length > 0
      ? db.prepare(sql).all(params)
      : db.prepare(sql).all();

    // Sort in JS: overdue → in_progress → pending → completed
    const order: Record<string, number> = { overdue: 0, in_progress: 1, pending: 2, completed: 3 };
    const sorted = (rows as any[]).sort((a, b) => {
      const diff = (order[a.status] ?? 4) - (order[b.status] ?? 4);
      if (diff !== 0) return diff;
      return (a.due_date ?? '').localeCompare(b.due_date ?? '');
    });

    res.json(sorted);
  } catch (err: any) {
    console.error('GET /tasks error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST create task
tasksRouter.post('/', (req, res) => {
  try {
    const {
      relocationId, customerName, title, description,
      assignedToId, assignedToName, dueDate, priority = 'medium',
    } = req.body;

    if (!relocationId || !title || !dueDate) {
      return res.status(400).json({ error: 'relocationId, title, dueDate required' });
    }

    const id = `t${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const isOverdue = new Date(dueDate) < new Date();
    const status = isOverdue ? 'overdue' : 'pending';

    db.prepare(`
      INSERT INTO tasks (
        id, relocation_id, customer_name, title, description,
        assigned_to_id, assigned_to_name, due_date, status, priority, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, relocationId, customerName ?? '', title, description ?? null,
      assignedToId ?? '', assignedToName ?? '', dueDate, status, priority, createdAt
    );

    res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  } catch (err: any) {
    console.error('POST /tasks error:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
tasksRouter.put('/:id', (req, res) => {
  try {
    const { status, priority, assignedToId, assignedToName, dueDate, completedAt } = req.body;
    const finished = status === 'completed'
      ? (completedAt || new Date().toISOString().split('T')[0])
      : null;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    db.prepare(`
      UPDATE tasks SET
        status         = ?,
        priority       = ?,
        assigned_to_id = ?,
        assigned_to_name = ?,
        due_date       = ?,
        completed_at   = ?
      WHERE id = ?
    `).run(
      status       ?? existing.status,
      priority     ?? existing.priority,
      assignedToId ?? existing.assigned_to_id,
      assignedToName ?? existing.assigned_to_name,
      dueDate      ?? existing.due_date,
      finished,
      req.params.id
    );

    res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
  } catch (err: any) {
    console.error('PUT /tasks/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
tasksRouter.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /tasks/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
