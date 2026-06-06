const express = require('express');
const router = express.Router();
const { getContacts: getAll, getContact: getOne, createContact: create, updateContact: update, replyContact: reply, deleteContact: remove } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', create); // public endpoint for contact form
router.put('/:id', protect, authorize('admin', 'editor'), update);
router.post('/:id/reply', protect, authorize('admin', 'editor'), reply);
router.delete('/:id', protect, authorize('admin', 'editor'), remove);

module.exports = router;
