const express = require('express');
const router = express.Router();
const { getUsers: getAll, createUser: create, updateUser: update, deleteUser: remove } = require('../controllers/userController');
const getOne = (req,res)=>res.status(404).send('Not implemented');
const { protect, authorize } = require('../middleware/auth');
const admin = authorize('admin');

router.get('/', protect, admin, getAll);
router.get('/:id', protect, admin, getOne);
router.post('/', protect, admin, create);
router.put('/:id', protect, admin, update);
router.delete('/:id', protect, admin, remove);

module.exports = router;
