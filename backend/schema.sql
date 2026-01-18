-- schema.sql - PostgreSQL Database Schema for Family Tree App

-- Create the family_members table
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

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);

-- Create index on generation for sorting
CREATE INDEX IF NOT EXISTS idx_family_members_generation ON family_members(generation);

-- Optional: Insert sample data
INSERT INTO family_members (user_id, name, relation, generation, image_url) VALUES
('user_123', 'John Smith', 'Grandfather', 2, 'https://i.pravatar.cc/150?img=12'),
('user_123', 'Mary Smith', 'Grandmother', 2, 'https://i.pravatar.cc/150?img=47'),
('user_123', 'Robert Smith', 'Father', 1, 'https://i.pravatar.cc/150?img=33'),
('user_123', 'Sarah Smith', 'Mother', 1, 'https://i.pravatar.cc/150?img=45'),
('user_123', 'Michael Smith', 'Self', 0, 'https://i.pravatar.cc/150?img=68')
ON CONFLICT DO NOTHING;