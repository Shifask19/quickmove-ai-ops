import { Router } from 'express';
import { db } from '../db.js';

export const vendorsRouter = Router();

vendorsRouter.get('/', (req, res) => {
  try {
    const { city, type, available } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];

    if (city) { conditions.push('city LIKE ?'); params.push(`%${city}%`); }
    if (type && type !== 'all') { conditions.push('type = ?'); params.push(type); }
    if (available === 'true')  { conditions.push('available = 1'); }
    if (available === 'false') { conditions.push('available = 0'); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const stmt = db.prepare(`SELECT * FROM vendors ${where} ORDER BY rating DESC`);
    const vendors = (params.length > 0 ? stmt.all(params) : stmt.all()) as any[];

    const withBookings = vendors.map(v => ({
      ...v,
      bookings: db.prepare('SELECT * FROM vendor_bookings WHERE vendor_id = ?').all(v.id),
    }));

    res.json(withBookings);
  } catch (err: any) {
    console.error('GET /vendors error:', err.message);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

vendorsRouter.get('/bookings', (_req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM vendor_bookings ORDER BY booking_date DESC').all());
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

vendorsRouter.post('/bookings', (req, res) => {
  try {
    const { relocationId, customerName, vendorId, vendorName, bookingDate, quote, notes } = req.body;
    if (!relocationId || !vendorId || !bookingDate || !quote) {
      return res.status(400).json({ error: 'relocationId, vendorId, bookingDate, quote required' });
    }
    const id = `vb${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO vendor_bookings (
        id, relocation_id, customer_name, vendor_id, vendor_name,
        booking_date, status, quote, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    `).run(
      id, relocationId, customerName ?? '', vendorId, vendorName ?? '',
      bookingDate, Number(quote), notes ?? null, createdAt
    );

    res.status(201).json(db.prepare('SELECT * FROM vendor_bookings WHERE id = ?').get(id));
  } catch (err: any) {
    console.error('POST /vendors/bookings error:', err.message);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

vendorsRouter.put('/bookings/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM vendor_bookings WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { status, finalAmount } = req.body;
    db.prepare('UPDATE vendor_bookings SET status = ?, final_amount = ? WHERE id = ?')
      .run(status ?? existing.status, finalAmount ?? existing.final_amount, req.params.id);

    res.json(db.prepare('SELECT * FROM vendor_bookings WHERE id = ?').get(req.params.id));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});
