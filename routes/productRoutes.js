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
router.post('/getCompanyDemand',productController.getCompanyDemands);
router.post('/getAllDemand',productController.getAllDemand);                  // Used in Admin & Manager Paenl to see all demands of user
router.post('/getAllCompanyDemand',productController.allCompanyDemand); 
router.post('/getPendingDemand',productController.getUserPendingDemand);          // Used in Admin Panel to see all pending demands
router.post('/getCompanyPendingDemand',productController.getCompanyPendingDemand);  
router.post('/unissuedDemandList',productController.getUnissuedDemandList)    // Used in Moderator Panel to get unissued demand list of users
router.post('/company-unissuedDemandList',productController.getUnissuedCompanyDemandList) // Used in Moderator Panel to get unissued company demand list
router.post('/filterProducts',productController.filterProducts)               // Used in Moderator Panel to get filtered product for useer


router.post('/getOutOfStock',productController.outOfStockCalculator)          // Used in Manager Panel to check for OUT OF STOCK product
router.post('/getProductReceived',productController.productReceived)          // Used in User Panel to get product that issued to him
router.post('/getProductReport',productController.allProductReport)




//For Sending CSV Files
router.post('/getStoreReportCSV',productController.getstoreReportCSV);     // Used in Store Report panel to download CSV
router.post('/get-products-csv',productController.sendProductCSV)            // Used in all product report panel to get CSV



//For Receiving CSV Files
router.post('/upload-product-csv', upload.single('csvFile'), productController.receiveProductCSV); // Used to add product via CSV


// Operation routes
router.post('/add', productController.addProduct);                         // Used in Admin Panel to add new product
router.post('/makeDemand',productController.makeDemand);                   // Used in User Panel to raise a demand
router.post('/updateDemandStatus',productController.updateDemandStatus);   // Used in Manager Panel to Approve/Reject Demand
router.post('/updateCompanyDemandStatus',productController.updateCompanyDemandStatus);
router.post('/storeReport',productController.storeReport);                 // Used in Admin Panel for store report table
router.post('/assignSingleProduct',productController.assignSingleProduct); // Used in Moderator Panel to assign 1 product
router.post('/assignSingleCompanyProduct',productController.assignSingleCompanyProduct);
router.post('/company-makeDemand',productController.makeDemandCompany); 
router.post('/raiseTicket',productController.raiseTicket);                 // Used in User & Company Panel to raise Ticket
router.post('/getAllTickets',productController.getAllTickets);               // Used in Moderator Panel to get All Ticket
router.post('/updateTicket',productController.updateTicketStatus); 

// router.post('/demandReport',productController.demandReport);            // Used in Admin/Manager Panel for demand report table

module.exports = router;
