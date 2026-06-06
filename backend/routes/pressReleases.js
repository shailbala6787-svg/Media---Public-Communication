const express = require('express');
const router = express.Router();
const { getPressReleases: getAll, getPressRelease: getOne, createPressRelease: create, updatePressRelease: update, deletePressRelease: remove } = require('../controllers/pressReleaseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, authorize('admin', 'editor'), upload.array('attachments', 5), create);
router.put('/:id', protect, authorize('admin', 'editor'), update);
router.delete('/:id', protect, authorize('admin', 'editor'), remove);

module.exports = router;
