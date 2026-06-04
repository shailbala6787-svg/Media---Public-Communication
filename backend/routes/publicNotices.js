const express = require('express');
const router = express.Router();
const { getPublicNotices: getAll, getPublicNotice: getOne, createPublicNotice: create, updatePublicNotice: update, deletePublicNotice: remove } = require('../controllers/publicNoticeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, upload.single('attachment'), create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
