const express = require('express');
const router = express.Router();
const { getMediaItems: getAll, uploadMedia, deleteMedia: remove } = require('../controllers/mediaController');
// Mocks for missing controllers
const getOne = (req,res)=>res.status(404).send('Not implemented');
const update = (req,res)=>res.status(404).send('Not implemented');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.post('/upload', protect, upload.single('file'), uploadMedia);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
