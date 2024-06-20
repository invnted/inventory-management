const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Product routes
router.post('/add', productController.addProduct);
router.get('/get-products-csv',productController.getProductCSV)
router.post('/upload-product-csv', upload.single('csvFile'), productController.uploadCSV);

// Add other routes: get, update, delete

module.exports = router;
