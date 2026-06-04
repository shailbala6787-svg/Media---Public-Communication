const express = require('express');
const router = express.Router();
const { getContacts: getAll, getContact: getOne, createContact: create, updateContact: update, replyContact: reply, deleteContact: remove } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', create); // public endpoint for contact form
router.put('/:id', protect, update);
router.post('/:id/reply', protect, reply);
router.delete('/:id', protect, remove);

module.exports = router;
