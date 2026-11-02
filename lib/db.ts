import { Pool } from 'pg';
import {
  Customer,
  MenuItem,
  Order,
  Payment,
  Delivery,
  AdminSettings,
  initialCustomers,
  initialMenuItems,
  initialOrders,
  initialPayments,
  initialDeliveries,
  initialAdminSettings,
} from './initialData';

// Fallback in-memory state
let memoryCustomers: Customer[] = [...initialCustomers];
let memoryMenuItems: MenuItem[] = [...initialMenuItems];
let memoryOrders: Order[] = [...initialOrders];
let memoryPayments: Payment[] = [...initialPayments];
let memoryDeliveries: Delivery[] = [...initialDeliveries];
let memorySettings: AdminSettings = { ...initialAdminSettings };

// PostgreSQL Pool instance
let pool: Pool | null = null;
let dbInitialized = false;

export function getPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl === '""' || dbUrl === "''") {
    return null;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      console.log('[Neon PostgreSQL] Pool initialized successfully.');
    } catch (err) {
      console.error('[Neon PostgreSQL] Error creating pool:', err);
      pool = null;
    }
  }
  return pool;
}

export async function initDatabase(): Promise<boolean> {
  if (dbInitialized) return true;
  const p = getPool();
  if (!p) {
    console.log('[Database] Operating with persistent in-memory storage (DATABASE_URL not set).');
    return false;
  }

  try {
    const client = await p.connect();
    try {
      // Create Customers Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          customer_code VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(100),
          email VARCHAR(255),
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Menu Items Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS menu_items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          description TEXT,
          image_url TEXT,
          is_available BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Orders Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number VARCHAR(50) UNIQUE NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255),
          customer_phone VARCHAR(100),
          order_date VARCHAR(100) NOT NULL,
          total_amount NUMERIC(10, 2) NOT NULL,
          subtotal NUMERIC(10, 2) DEFAULT 0,
          tax NUMERIC(10, 2) DEFAULT 0,
          delivery_fee NUMERIC(10, 2) DEFAULT 0,
          status VARCHAR(50) DEFAULT 'Pending',
          fulfillment_type VARCHAR(100) DEFAULT 'Home Delivery',
          payment_method VARCHAR(100) DEFAULT 'UPI',
          delivery_address TEXT,
          table_or_notes VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Order Items Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          item_name VARCHAR(255) NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          unit_price NUMERIC(10, 2) NOT NULL,
          subtotal NUMERIC(10, 2) NOT NULL,
          image_url TEXT
        );
      `);

      // Create Payments Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          payment_code VARCHAR(50) UNIQUE NOT NULL,
          order_number VARCHAR(50) NOT NULL,
          payment_date VARCHAR(100) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          payment_status VARCHAR(50) NOT NULL,
          amount NUMERIC(10, 2) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Deliveries Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS deliveries (
          id SERIAL PRIMARY KEY,
          delivery_code VARCHAR(50) UNIQUE NOT NULL,
          order_number VARCHAR(50) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          delivery_address TEXT NOT NULL,
          delivery_status VARCHAR(50) NOT NULL,
          delivery_date VARCHAR(100) NOT NULL,
          estimated_minutes INTEGER DEFAULT 15,
          driver_name VARCHAR(255),
          city VARCHAR(100) DEFAULT 'Chennai',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Admin Settings Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) DEFAULT 'Gokul Raj',
          email VARCHAR(255) DEFAULT 'admin@magiskitchen.com',
          role_description VARCHAR(255) DEFAULT 'Master Kitchen Supervisor & Operations Manager',
          theme VARCHAR(50) DEFAULT 'light',
          branch VARCHAR(255) DEFAULT 'Downtown Flagship Kitchen (Main)',
          default_view VARCHAR(255) DEFAULT 'Live Order Grid & Kitchen Queue',
          audio_alert BOOLEAN DEFAULT TRUE,
          low_stock_warning BOOLEAN DEFAULT TRUE,
          daily_digest BOOLEAN DEFAULT FALSE
        );
      `);

      // Seed if empty
      const custCheck = await client.query('SELECT COUNT(*) FROM customers');
      if (parseInt(custCheck.rows[0].count) === 0) {
        for (const c of initialCustomers) {
          await client.query(
            `INSERT INTO customers (customer_code, name, phone, email, address) VALUES ($1, $2, $3, $4, $5)`,
            [c.customer_code, c.name, c.phone, c.email, c.address]
          );
        }
      }

      const menuCheck = await client.query('SELECT COUNT(*) FROM menu_items');
      if (parseInt(menuCheck.rows[0].count) === 0) {
        for (const m of initialMenuItems) {
          await client.query(
            `INSERT INTO menu_items (name, category, price, description, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6)`,
            [m.name, m.category, m.price, m.description, m.image_url, m.is_available]
          );
        }
      }

      const orderCheck = await client.query('SELECT COUNT(*) FROM orders');
      if (parseInt(orderCheck.rows[0].count) === 0) {
        for (const o of initialOrders) {
          const res = await client.query(
            `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, order_date, total_amount, subtotal, tax, delivery_fee, status, fulfillment_type, payment_method, delivery_address, table_or_notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
            [
              o.order_number,
              o.customer_name,
              o.customer_email || '',
              o.customer_phone || '',
              o.order_date,
              o.total_amount,
              o.subtotal,
              o.tax,
              o.delivery_fee,
              o.status,
              o.fulfillment_type,
              o.payment_method,
              o.delivery_address,
              o.table_or_notes || '',
            ]
          );
          const orderId = res.rows[0].id;
          for (const item of o.items) {
            await client.query(
              `INSERT INTO order_items (order_id, item_name, quantity, unit_price, subtotal, image_url) VALUES ($1, $2, $3, $4, $5, $6)`,
              [orderId, item.item_name, item.quantity, item.unit_price, item.subtotal, item.image_url || '']
            );
          }
        }
      }

      const payCheck = await client.query('SELECT COUNT(*) FROM payments');
      if (parseInt(payCheck.rows[0].count) === 0) {
        for (const p of initialPayments) {
          await client.query(
            `INSERT INTO payments (payment_code, order_number, payment_date, payment_method, payment_status, amount, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [p.payment_code, p.order_number, p.payment_date, p.payment_method, p.payment_status, p.amount, p.notes || '']
          );
        }
      }

      const delCheck = await client.query('SELECT COUNT(*) FROM deliveries');
      if (parseInt(delCheck.rows[0].count) === 0) {
        for (const d of initialDeliveries) {
          await client.query(
            `INSERT INTO deliveries (delivery_code, order_number, customer_name, delivery_address, delivery_status, delivery_date, estimated_minutes, driver_name, city)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [d.delivery_code, d.order_number, d.customer_name, d.delivery_address, d.delivery_status, d.delivery_date, d.estimated_minutes, d.driver_name, d.city]
          );
        }
      }

      const setCheck = await client.query('SELECT COUNT(*) FROM admin_settings');
      if (parseInt(setCheck.rows[0].count) === 0) {
        await client.query(
          `INSERT INTO admin_settings (full_name, email, role_description, theme, branch, default_view, audio_alert, low_stock_warning, daily_digest)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            initialAdminSettings.full_name,
            initialAdminSettings.email,
            initialAdminSettings.role_description,
            initialAdminSettings.theme,
            initialAdminSettings.branch,
            initialAdminSettings.default_view,
            initialAdminSettings.audio_alert,
            initialAdminSettings.low_stock_warning,
            initialAdminSettings.daily_digest,
          ]
        );
      }

      dbInitialized = true;
      console.log('[Neon PostgreSQL] Schema verified and seeded successfully.');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Neon PostgreSQL] Failed to initialize DB, using fallback memory state:', error);
    return false;
  }
}

// ================= CUSTOMERS =================
export async function getCustomers(): Promise<Customer[]> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query('SELECT * FROM customers ORDER BY id ASC');
      return res.rows;
    } catch (err) {
      console.error('Error fetching customers from PostgreSQL:', err);
    }
  }
  return memoryCustomers;
}

export async function addCustomer(data: Omit<Customer, 'id' | 'customer_code'>): Promise<Customer> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const countRes = await p.query('SELECT COUNT(*) FROM customers');
      const nextNum = parseInt(countRes.rows[0].count) + 1001;
      const code = `#CUST-${nextNum}`;
      const res = await p.query(
        `INSERT INTO customers (customer_code, name, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [code, data.name, data.phone, data.email, data.address]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error adding customer to PostgreSQL:', err);
    }
  }

  const newCust: Customer = {
    id: memoryCustomers.length > 0 ? Math.max(...memoryCustomers.map((c) => c.id)) + 1 : 1,
    customer_code: `#CUST-${1000 + memoryCustomers.length + 1}`,
    ...data,
    created_at: new Date().toISOString(),
  };
  memoryCustomers.push(newCust);
  return newCust;
}

export async function updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | null> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query(
        `UPDATE customers SET name = COALESCE($1, name), phone = COALESCE($2, phone), email = COALESCE($3, email), address = COALESCE($4, address)
         WHERE id = $5 RETURNING *`,
        [data.name, data.phone, data.email, data.address, id]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.error('Error updating customer in PostgreSQL:', err);
    }
  }

  const idx = memoryCustomers.findIndex((c) => c.id === id);
  if (idx !== -1) {
    memoryCustomers[idx] = { ...memoryCustomers[idx], ...data };
    return memoryCustomers[idx];
  }
  return null;
}

export async function deleteCustomer(id: number): Promise<boolean> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      await p.query('DELETE FROM customers WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error('Error deleting customer in PostgreSQL:', err);
    }
  }

  const initialLen = memoryCustomers.length;
  memoryCustomers = memoryCustomers.filter((c) => c.id !== id);
  return memoryCustomers.length < initialLen;
}

// ================= MENU ITEMS =================
export async function getMenuItems(): Promise<MenuItem[]> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query('SELECT * FROM menu_items ORDER BY id ASC');
      return res.rows.map((r) => ({
        ...r,
        price: parseFloat(r.price),
      }));
    } catch (err) {
      console.error('Error getting menu items from PostgreSQL:', err);
    }
  }
  return memoryMenuItems;
}

export async function addMenuItem(data: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query(
        `INSERT INTO menu_items (name, category, price, description, image_url, is_available)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [data.name, data.category, data.price, data.description, data.image_url, data.is_available ?? true]
      );
      const row = res.rows[0];
      return { ...row, price: parseFloat(row.price) };
    } catch (err) {
      console.error('Error adding menu item to PostgreSQL:', err);
    }
  }

  const newItem: MenuItem = {
    id: memoryMenuItems.length > 0 ? Math.max(...memoryMenuItems.map((m) => m.id)) + 1 : 1,
    ...data,
  };
  memoryMenuItems.unshift(newItem);
  return newItem;
}

export async function updateMenuItem(id: number, data: Partial<MenuItem>): Promise<MenuItem | null> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query(
        `UPDATE menu_items SET
          name = COALESCE($1, name),
          category = COALESCE($2, category),
          price = COALESCE($3, price),
          description = COALESCE($4, description),
          image_url = COALESCE($5, image_url),
          is_available = COALESCE($6, is_available)
         WHERE id = $7 RETURNING *`,
        [data.name, data.category, data.price, data.description, data.image_url, data.is_available, id]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return { ...row, price: parseFloat(row.price) };
      }
    } catch (err) {
      console.error('Error updating menu item in PostgreSQL:', err);
    }
  }

  const idx = memoryMenuItems.findIndex((m) => m.id === id);
  if (idx !== -1) {
    memoryMenuItems[idx] = { ...memoryMenuItems[idx], ...data };
    return memoryMenuItems[idx];
  }
  return null;
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      await p.query('DELETE FROM menu_items WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error('Error deleting menu item in PostgreSQL:', err);
    }
  }

  const initialLen = memoryMenuItems.length;
  memoryMenuItems = memoryMenuItems.filter((m) => m.id !== id);
  return memoryMenuItems.length < initialLen;
}

// ================= ORDERS =================
export async function getOrders(): Promise<Order[]> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const ordersRes = await p.query('SELECT * FROM orders ORDER BY id DESC');
      const orders: Order[] = [];

      for (const o of ordersRes.rows) {
        const itemsRes = await p.query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
        orders.push({
          id: o.id,
          order_number: o.order_number,
          customer_name: o.customer_name,
          customer_email: o.customer_email,
          customer_phone: o.customer_phone,
          order_date: o.order_date,
          total_amount: parseFloat(o.total_amount),
          subtotal: parseFloat(o.subtotal || 0),
          tax: parseFloat(o.tax || 0),
          delivery_fee: parseFloat(o.delivery_fee || 0),
          status: o.status,
          fulfillment_type: o.fulfillment_type,
          payment_method: o.payment_method,
          delivery_address: o.delivery_address,
          table_or_notes: o.table_or_notes,
          items: itemsRes.rows.map((it) => ({
            id: it.id,
            order_id: it.order_id,
            item_name: it.item_name,
            quantity: it.quantity,
            unit_price: parseFloat(it.unit_price),
            subtotal: parseFloat(it.subtotal),
            image_url: it.image_url,
          })),
        });
      }
      return orders;
    } catch (err) {
      console.error('Error fetching orders from PostgreSQL:', err);
    }
  }
  return memoryOrders;
}

export async function getOrderById(idOrNumber: string | number): Promise<Order | null> {
  const orders = await getOrders();
  const idStr = String(idOrNumber).replace('#', '');
  return (
    orders.find(
      (o) => String(o.id) === idStr || o.order_number.replace('#', '') === idStr
    ) || null
  );
}

export async function updateOrderStatus(orderNumberOrId: string | number, status: Order['status']): Promise<Order | null> {
  const p = getPool();
  const idStr = String(orderNumberOrId);
  const formattedCode = idStr.startsWith('#') ? idStr : `#${idStr}`;

  if (p) {
    try {
      await initDatabase();
      await p.query(
        `UPDATE orders SET status = $1 WHERE order_number = $2 OR id = $3`,
        [status, formattedCode, isNaN(Number(idStr)) ? 0 : Number(idStr)]
      );
      return await getOrderById(orderNumberOrId);
    } catch (err) {
      console.error('Error updating order status in PostgreSQL:', err);
    }
  }

  const order = memoryOrders.find(
    (o) => o.order_number === formattedCode || String(o.id) === idStr
  );
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}

// ================= DELIVERIES =================
export async function getDeliveries(): Promise<Delivery[]> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query('SELECT * FROM deliveries ORDER BY id ASC');
      return res.rows;
    } catch (err) {
      console.error('Error fetching deliveries from PostgreSQL:', err);
    }
  }
  return memoryDeliveries;
}

export async function updateDeliveryStatus(deliveryCode: string, status: Delivery['delivery_status']): Promise<Delivery | null> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query(
        `UPDATE deliveries SET delivery_status = $1 WHERE delivery_code = $2 RETURNING *`,
        [status, deliveryCode]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.error('Error updating delivery status in PostgreSQL:', err);
    }
  }

  const delivery = memoryDeliveries.find((d) => d.delivery_code === deliveryCode);
  if (delivery) {
    delivery.delivery_status = status;
    return delivery;
  }
  return null;
}

export async function addDelivery(data: Omit<Delivery, 'id'>): Promise<Delivery> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query(
        `INSERT INTO deliveries (delivery_code, order_number, customer_name, delivery_address, delivery_status, delivery_date, estimated_minutes, driver_name, city)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [data.delivery_code, data.order_number, data.customer_name, data.delivery_address, data.delivery_status, data.delivery_date, data.estimated_minutes, data.driver_name, data.city]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error adding delivery to PostgreSQL:', err);
    }
  }

  const newDelivery: Delivery = {
    id: memoryDeliveries.length > 0 ? Math.max(...memoryDeliveries.map((d) => d.id)) + 1 : 1,
    ...data,
  };
  memoryDeliveries.unshift(newDelivery);
  return newDelivery;
}

// ================= PAYMENTS =================
export async function getPayments(): Promise<Payment[]> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query('SELECT * FROM payments ORDER BY id DESC');
      return res.rows.map((r) => ({
        ...r,
        amount: parseFloat(r.amount),
      }));
    } catch (err) {
      console.error('Error fetching payments from PostgreSQL:', err);
    }
  }
  return memoryPayments;
}

export async function addPayment(data: Omit<Payment, 'id' | 'payment_code'>): Promise<Payment> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const countRes = await p.query('SELECT COUNT(*) FROM payments');
      const nextNum = parseInt(countRes.rows[0].count) + 9022;
      const code = `#PAY-${nextNum}`;
      const res = await p.query(
        `INSERT INTO payments (payment_code, order_number, payment_date, payment_method, payment_status, amount, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [code, data.order_number, data.payment_date, data.payment_method, data.payment_status, data.amount, data.notes || '']
      );
      const row = res.rows[0];
      return { ...row, amount: parseFloat(row.amount) };
    } catch (err) {
      console.error('Error adding payment to PostgreSQL:', err);
    }
  }

  const newPay: Payment = {
    id: memoryPayments.length > 0 ? Math.max(...memoryPayments.map((p) => p.id)) + 1 : 1,
    payment_code: `#PAY-${9020 + memoryPayments.length + 1}`,
    ...data,
  };
  memoryPayments.unshift(newPay);
  return newPay;
}

// ================= SETTINGS =================
export async function getSettings(): Promise<AdminSettings> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query('SELECT * FROM admin_settings LIMIT 1');
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.error('Error fetching settings from PostgreSQL:', err);
    }
  }
  return memorySettings;
}

export async function updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
  const p = getPool();
  if (p) {
    try {
      await initDatabase();
      const res = await p.query(
        `UPDATE admin_settings SET
          full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          role_description = COALESCE($3, role_description),
          theme = COALESCE($4, theme),
          branch = COALESCE($5, branch),
          default_view = COALESCE($6, default_view),
          audio_alert = COALESCE($7, audio_alert),
          low_stock_warning = COALESCE($8, low_stock_warning),
          daily_digest = COALESCE($9, daily_digest)
         WHERE id = (SELECT id FROM admin_settings LIMIT 1) RETURNING *`,
        [
          data.full_name,
          data.email,
          data.role_description,
          data.theme,
          data.branch,
          data.default_view,
          data.audio_alert,
          data.low_stock_warning,
          data.daily_digest,
        ]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.error('Error updating settings in PostgreSQL:', err);
    }
  }

  memorySettings = { ...memorySettings, ...data };
  return memorySettings;
}

