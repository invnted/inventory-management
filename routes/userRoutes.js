const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Admins Routes
router.post('/admin-register', userController.registerAdmin);
router.post('/admin-login', userController.loginAdmin);
router.get('/', auth, userController.getAllAdmins);

// Managers Routes
router.post('/manager-register', userController.registerManager);
router.post('/manager-login', userController.loginManager);
router.post('/manager-getAll',userController.getAllManagers);
router.post('/manager-update',userController.updateManager);
router.post('/manager-delete',userController.deleteManager);


// Users Routes
router.post('/user-register', userController.registerUser);
router.post('/user-login', userController.loginUser);
router.post('/user-getAll',userController.getAllUsers);
router.post('/user-update',userController.updateUser);
router.post('/user-delete',userController.deleteUser);


// Moderators Routes
router.post('/register', userController.registerModerator);
router.post('/login', userController.loginModerator);
router.post('/moderator-getAll',userController.getAllModerator);
router.post('/moderator-update',userController.updateModerator);
router.post('/moderator-delete',userController.deleteModerator);




module.exports = router;
