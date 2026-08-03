import { Router } from 'express';
import { db } from '../db.js';

export const vendorsRouter = Router();

vendorsRouter.get('/', (req, res) => {
  const { city, type, available } = req.query;
  let query = 'SELECT * FROM vendors WHERE 1=1';
  const params: any[] = [];

  if (city)      { query += ' AND city LIKE ?';    params.push(`%${city}%`); }
  if (type && type !== 'all') { query += ' AND type=?'; params.push(type); }
  if (available === 'true')  { query += ' AND available=1'; }
  if (available === 'false') { query += ' AND available=0'; }

  const vendors = db.prepare(query).all(...params);

  // Attach bookings to each vendor
  const withBookings = vendors.map((v: any) => ({
    ...v,
    bookings: db.prepare('SELECT * FROM vendor_bookings WHERE vendor_id=?').all(v.id),
  }));

  res.json(withBookings);
});

vendorsRouter.get('/bookings', (_req, res) => {
  res.json(db.prepare('SELECT * FROM vendor_bookings ORDER BY booking_date DESC').all());
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
      INSERT INTO vendor_bookings (id, relocation_id, customer_name, vendor_id, vendor_name,
        booking_date, status, quote, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    `).run(id, relocationId, customerName, vendorId, vendorName, bookingDate, quote, notes || null, createdAt);

    res.status(201).json(db.prepare('SELECT * FROM vendor_bookings WHERE id=?').get(id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

vendorsRouter.put('/bookings/:id', (req, res) => {
  const { status, finalAmount } = req.body;
  db.prepare('UPDATE vendor_bookings SET status=COALESCE(?,status), final_amount=COALESCE(?,final_amount) WHERE id=?')
    .run(status, finalAmount, req.params.id);
  res.json(db.prepare('SELECT * FROM vendor_bookings WHERE id=?').get(req.params.id));
});
