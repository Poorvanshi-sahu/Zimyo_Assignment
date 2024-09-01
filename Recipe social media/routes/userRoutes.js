const express = require('express');
const { getUserProfile, getAllUsers, getSingleUser, followAndUnfollowUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authentication');
const router = express.Router();

router.get('/profile',protect, getUserProfile);
router.get('/profile/singleUser/:id', protect, getSingleUser)
router.get('/profile/allUsers', protect, getAllUsers);
router.post('/followUnfollowUser/:id', protect, followAndUnfollowUser)

module.exports = router;
