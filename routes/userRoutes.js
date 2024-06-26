const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Admins routes
router.post('/admin-register', userController.registerAdmin);
router.post('/admin-login', userController.loginAdmin);
router.get('/', auth, userController.getAllAdmins);
router.get('/:id', auth, userController.getAdminById);
// router.put('/:id', auth, userController.updateAdmin);
// router.delete('/:id', auth, userController.deleteAdmin);

// Managers routes
router.post('/manager-register', userController.registerManager);
router.post('/manager-login', userController.loginManager);
router.post('/manager-getAll',userController.getAllManagers);
router.post('/manager-update',userController.updateManager);
router.post('/manager-delete',userController.deleteManager);


// Users routes
router.post('/user-register', userController.registerUser);
router.post('/user-login', userController.loginUser);
router.post('/user-getAll',userController.getAllUsers);
router.post('/user-update',userController.updateUser);
router.post('/user-delete',userController.deleteUser);





module.exports = router;
