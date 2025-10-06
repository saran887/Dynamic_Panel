import express from 'express';
import cors from 'cors';
import { sequelize, syncModels } from './models.js';
import authRoutes from './authRoutes.mjs';
import contactRoutes from './contactRoutes.mjs';

const app = express();
app.use(cors());
app.use(express.json());


// Test DB connection and sync tables
sequelize.authenticate()
  .then(async () => {
    console.log('Connected to MySQL via Sequelize');
    await syncModels();
    console.log('Tables synced');
  })
  .catch(err => console.error('Unable to connect to DB:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Contact routes
app.use('/api/contacts', contactRoutes);

// Utility endpoint: If no users, delete all records and reset user id


app.listen(3001, () => {
  console.log('Server running on port 3001');
});
