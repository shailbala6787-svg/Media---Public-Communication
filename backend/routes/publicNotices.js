const express = require('express');
const router = express.Router();
const { getPublicNotices: getAll, getPublicNotice: getOne, createPublicNotice: create, updatePublicNotice: update, deletePublicNotice: remove } = require('../controllers/publicNoticeController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, authorize('admin', 'editor'), upload.single('attachment'), create);
router.put('/:id', protect, authorize('admin', 'editor'), update);
router.delete('/:id', protect, authorize('admin', 'editor'), remove);

module.exports = router;
