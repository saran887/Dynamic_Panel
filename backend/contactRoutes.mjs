import express from 'express';
import { Contact } from './models.js';

const router = express.Router();

// Get contacts by userId
router.get('/:userId', async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { userId: req.params.userId } });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add contact
router.post('/', async (req, res) => {
  const { userId, email, mobileNumber, alternateMobileNumber, whatsappNumber, mapUrl } = req.body;
  try {
    const contact = await Contact.create({
      userId,
      email,
      mobileNumber,
      alternateMobileNumber,
      whatsappNumber,
      mapUrl
    });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
