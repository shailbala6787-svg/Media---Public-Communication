const express = require('express');
const router = express.Router();
const { getAnnouncements: getAll, getAnnouncement: getOne, createAnnouncement: create, updateAnnouncement: update, deleteAnnouncement: remove } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, authorize('admin', 'editor'), create);
router.put('/:id', protect, authorize('admin', 'editor'), update);
router.delete('/:id', protect, authorize('admin', 'editor'), remove);

module.exports = router;
