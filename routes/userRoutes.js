const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Admins Routes
router.post('/admin-register', userController.registerAdmin);
router.post('/admin-login', userController.loginAdmin);


// Managers Routes
router.post('/manager-register', auth, userController.registerManager);
router.post('/manager-login', userController.loginManager);
router.post('/manager-getAll', auth, userController.getAllManagers);
router.post('/manager-update',userController.updateManager);
router.post('/manager-delete', auth,userController.deleteManager);
router.post('/download-manager-csv',auth,userController.sendManagerCSV);
router.post('/upload-manager-csv',auth,upload.single('csvFile'), userController.receiveManagerCSV); 



// Users Routes
router.post('/user-register', auth,userController.registerUser);
router.post('/user-login', userController.loginUser);
router.post('/user-getAll',auth,userController.getAllUsers);
router.post('/user-update',auth,userController.updateUser);
router.post('/user-delete',auth,userController.deleteUser);
router.post('/download-user-csv',auth,userController.sendUserCSV);
router.post('/download-userDemand-csv',auth,userController.sendUserDemandCSV);
router.post('/upload-user-csv',auth,upload.single('csvFile'), userController.receiveUserCSV); 


// Moderators Routes
router.post('/register',auth,userController.registerModerator);
router.post('/login',userController.loginModerator);
router.post('/moderator-getAll',auth,userController.getAllModerator);
router.post('/moderator-update',auth,userController.updateModerator);
router.post('/moderator-delete',auth,userController.deleteModerator);
router.post('/download-moderator-csv',auth,userController.sendModeratorCSV);
router.post('/upload-moderator-csv',auth, upload.single('csvFile'), userController.receiveModeratorCSV); 


//Company Routes
router.post('/company-register',auth,userController.registerCompany);
router.post('/company-login', userController.loginCompany);
router.post('/company-getAll',auth,userController.getAllCompanies);
router.post('/company-update',auth,userController.updateCompany);
router.post('/company-delete',auth,userController.deleteCompany);
router.post('/download-companyDemand-csv',auth,userController.sendCompanyDemandCSV);
router.post('/download-company-csv',auth,userController.sendCompanyCSV);
router.post('/upload-company-csv',auth,upload.single('csvFile'), userController.receiveCompanyCSV); 

module.exports = router;
