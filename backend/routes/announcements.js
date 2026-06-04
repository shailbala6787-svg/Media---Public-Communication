const express = require('express');
const router = express.Router();
const { getAnnouncements: getAll, getAnnouncement: getOne, createAnnouncement: create, updateAnnouncement: update, deleteAnnouncement: remove } = require('../controllers/announcementController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
