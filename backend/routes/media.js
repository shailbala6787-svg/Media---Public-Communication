const express = require('express');
const router = express.Router();
const { getMediaItems: getAll, uploadMedia, deleteMedia: remove } = require('../controllers/mediaController');
// Mocks for missing controllers
const getOne = (req,res)=>res.status(404).send('Not implemented');
const update = (req,res)=>res.status(404).send('Not implemented');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('file'), uploadMedia);
router.put('/:id', protect, authorize('admin', 'editor'), update);
router.delete('/:id', protect, authorize('admin', 'editor'), remove);

module.exports = router;
