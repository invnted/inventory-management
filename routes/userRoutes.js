const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
router.post('/download-manager-csv',userController.sendManagerCSV);
router.post('/upload-manager-csv', upload.single('csvFile'), userController.receiveManagerCSV); 



// Users Routes
router.post('/user-register', userController.registerUser);
router.post('/user-login', userController.loginUser);
router.post('/user-getAll',userController.getAllUsers);
router.post('/user-update',userController.updateUser);
router.post('/user-delete',userController.deleteUser);
router.post('/download-user-csv',userController.sendUserCSV);
router.post('/upload-user-csv', upload.single('csvFile'), userController.receiveUserCSV); 


// Moderators Routes
router.post('/register', userController.registerModerator);
router.post('/login', userController.loginModerator);
router.post('/moderator-getAll',userController.getAllModerator);
router.post('/moderator-update',userController.updateModerator);
router.post('/moderator-delete',userController.deleteModerator);
router.post('/download-moderator-csv',userController.sendModeratorCSV);
router.post('/upload-moderator-csv', upload.single('csvFile'), userController.receiveModeratorCSV); 


//Company Routes
router.post('/company-register', userController.registerCompany);
router.post('/company-login', userController.loginCompany);
router.post('/company-getAll',userController.getAllCompanies);
router.post('/company-update',userController.updateCompany);
router.post('/company-delete',userController.deleteCompany);
router.post('/download-company-csv',userController.sendCompanyCSV);
router.post('/upload-company-csv', upload.single('csvFile'), userController.receiveCompanyCSV); 

module.exports = router;
