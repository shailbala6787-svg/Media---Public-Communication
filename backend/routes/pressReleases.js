const express = require('express');
const router = express.Router();
const { getPressReleases: getAll, getPressRelease: getOne, createPressRelease: create, updatePressRelease: update, deletePressRelease: remove } = require('../controllers/pressReleaseController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/', protect, upload.array('attachments', 5), create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
