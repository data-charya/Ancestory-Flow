// Vercel Serverless Function Entry Point
// This wraps the Express app for Vercel deployment

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool (Aiven)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

// Auto-create table if needed
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        relation VARCHAR(100),
        years VARCHAR(100),
        image_url TEXT,
        bio TEXT,
        generation INTEGER DEFAULT 0,
        parents JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
      CREATE INDEX IF NOT EXISTS idx_family_members_generation ON family_members(generation);
    `);
  } catch (err) {
    console.error('DB init error:', err);
  }
};

initDB();

// --- API ENDPOINTS ---

// GET all members for a user
app.get('/api/members', async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM family_members WHERE user_id = $1 ORDER BY generation DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single member by ID
app.get('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM family_members WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new member
app.post('/api/members', async (req, res) => {
  const { userId, name, relation, years, imageUrl, bio, generation, parents } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO family_members 
       (user_id, name, relation, years, image_url, bio, generation, parents) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [userId, name, relation, years, imageUrl, bio, generation || 0, JSON.stringify(parents || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating member:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update member
app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const { name, relation, years, imageUrl, bio, generation, parents } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE family_members 
       SET name = $1, relation = $2, years = $3, image_url = $4, 
           bio = $5, generation = $6, parents = $7, updated_at = NOW()
       WHERE id = $8 
       RETURNING *`,
      [name, relation, years, imageUrl, bio, generation || 0, JSON.stringify(parents || []), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE member
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM family_members WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Export for Vercel
module.exports = app;

