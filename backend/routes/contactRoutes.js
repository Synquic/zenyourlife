const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// POST - Submit a new contact message
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, countryCode, phone, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (firstName, lastName, email, message)'
      });
    }

    const contactMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      countryCode: countryCode || '+32',
      phone,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// GET - Get all contact messages (for admin)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// GET - Get single message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch message' });
  }
});

// PUT - Update message status (for admin)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
});

// DELETE - Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

module.exports = router;
