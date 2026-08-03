import { db } from './db.js';

export function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      active_relocation_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS corporate_clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      active_relocations INTEGER DEFAULT 0,
      total_relocations INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'individual',
      corporate_client_id TEXT,
      corporate_client_name TEXT,
      assigned_coordinator_id TEXT NOT NULL,
      assigned_coordinator_name TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (assigned_coordinator_id) REFERENCES team_members(id)
    );

    CREATE TABLE IF NOT EXISTS relocations (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      from_city TEXT NOT NULL,
      from_address TEXT,
      to_city TEXT NOT NULL,
      to_address TEXT,
      move_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'inquiry',
      priority TEXT NOT NULL DEFAULT 'medium',
      estimated_budget REAL NOT NULL,
      actual_cost REAL,
      assigned_coordinator_id TEXT NOT NULL,
      assigned_coordinator_name TEXT NOT NULL,
      notes TEXT,
      completion_percentage INTEGER DEFAULT 5,
      created_at TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS relocation_stages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      relocation_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      started_at TEXT,
      completed_at TEXT,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      rent REAL NOT NULL,
      bedrooms INTEGER DEFAULT 2,
      bathrooms INTEGER DEFAULT 1,
      area INTEGER,
      status TEXT NOT NULL DEFAULT 'shortlisted',
      broker_name TEXT,
      broker_phone TEXT,
      visit_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'both',
      phone TEXT NOT NULL,
      email TEXT,
      city TEXT NOT NULL,
      rating REAL DEFAULT 4.0,
      total_jobs INTEGER DEFAULT 0,
      available INTEGER DEFAULT 1,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS vendor_bookings (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      vendor_id TEXT NOT NULL,
      vendor_name TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      quote REAL NOT NULL,
      final_amount REAL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id),
      FOREIGN KEY (vendor_id) REFERENCES vendors(id)
    );

    CREATE TABLE IF NOT EXISTS utilities (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      application_date TEXT,
      activation_date TEXT,
      account_number TEXT,
      notes TEXT,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS address_change_items (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      institution TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      submitted_date TEXT,
      completed_date TEXT,
      notes TEXT,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      uploaded_at TEXT,
      verified INTEGER DEFAULT 0,
      required INTEGER DEFAULT 1,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to_id TEXT NOT NULL,
      assigned_to_name TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      completed_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (relocation_id) REFERENCES relocations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      related_id TEXT,
      related_type TEXT,
      read INTEGER DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_events (
      id TEXT PRIMARY KEY,
      relocation_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      action TEXT NOT NULL,
      description TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'system'
    );
  `);

  console.log('✅ Database schema created');
}
