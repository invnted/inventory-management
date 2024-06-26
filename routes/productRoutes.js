const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Product routes
router.post('/add', productController.addProduct);
router.get('/get-products-csv',productController.getProductCSV)
router.post('/upload-product-csv', upload.single('csvFile'), productController.uploadCSV);
router.post('/productType-list',productController.getAllProductsType);
router.post('/getAllProduct',productController.getAllProducts);
router.post('/getProductStore',productController.getProductStore);
router.post('/makeDemand',productController.makeDemand);
router.post('/getUserDemand',productController.getUserDemands);
router.post('/getAllDemand',productController.getAllDemand);
router.post('/getPendingDemand',productController.getPendingDemand);
router.post('/storeReport',productController.storeReport);

module.exports = router;
