const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });


//Data Retrived For DropDown 
router.post('/productType-list',productController.getAllProductsType);    //Used to get list of all product Types 
router.post('/availableDemands',productController.productTypesInDemand);  //Used to get list of all product Types availble in demands


//Data Retrived For Table
router.post('/getAllProduct',productController.getAllProducts);               // Get List and data of all products
router.post('/getProductStore',productController.getProductStore);            // Used in Authorization Panel to draw graph
router.post('/getUserDemand',productController.getUserDemands);               // Used in User Panel user can see his own demands
router.post('/getAllDemand',productController.getAllDemand);                  // Used in Admin & Manager Paenl to see all demands
router.post('/getPendingDemand',productController.getPendingDemand);          // Used in Admin Panel to see all pending demandds
router.post('/unissuedDemandList',productController.getUnissuedDemandList)    // Used in Moderator Panel to get unissued demand list
router.post('/filterProducts',productController.filterProducts)               // Used in Moderator Panel to get filtered product 
router.post('/getOutOfStock',productController.outOfStockCalculator)          // Used in Manager Panel to check for OUT OF STOCK product
router.post('/getProductReceived',productController.productReceived)          // Used in User Panel to get product that issued to him


//For Sending CSV Files
router.post('/getStoreReportCSV',productController.getstoreReportCSV);                      //Used in Store Report panel to download CSV
// router.get('/get-products-csv',productController.getProductCSV)



//For Receiving CSV Files
router.post('/upload-product-csv', upload.single('csvFile'), productController.receiveProductCSV); // Used to add product via CSV


// Operation routes
router.post('/add', productController.addProduct);                         // Used in Admin Panel to add new product
router.post('/makeDemand',productController.makeDemand);                   // Used in User Panel to raise a demand
router.post('/updateDemandStatus',productController.updateDemandStatus);   // Used in Manager Panel to Approve/Reject Demand
router.post('/storeReport',productController.storeReport);                 // Used in Admin Panel for store report table
router.post('/assignSingleProduct',productController.assignSingleProduct); // Used in Moderator Panel to assign 1 product
// router.post('/demandReport',productController.demandReport);            // Used in Admin/Manager Panel for demand report table

module.exports = router;
