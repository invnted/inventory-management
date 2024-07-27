const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const auth = require('../middlewares/auth');

const upload = multer({ dest: 'uploads/' });


//Data Retrived For DropDown 
router.post('/productType-list',auth,productController.getAllProductsType);    //Used to get list of all product Types 
router.post('/availableDemands',auth,productController.productTypesInDemand);  //Used to get list of all product Types availble in demands


//Data Retrived For Table
router.post('/getAllProduct',auth,productController.getAllProducts);               // Get List and data of all products
router.post('/getProductStore',auth,productController.getProductStore);            // Used in Authorization Panel to draw graph
router.post('/getUserDemand',auth,productController.getUserDemands);               // Used in User Panel user can see his own demands
router.post('/getCompanyDemand',auth,productController.getCompanyDemands);
router.post('/getAllDemand',auth,productController.getAllDemand);                  // Used in Admin & Manager Paenl to see all demands of user
router.post('/getAllCompanyDemand',auth,productController.allCompanyDemand); 
router.post('/getPendingDemand',auth,productController.getUserPendingDemand);          // Used in Admin Panel to see all pending demands
router.post('/getCompanyPendingDemand',auth,productController.getCompanyPendingDemand);  
router.post('/unissuedDemandList',auth,productController.getUnissuedDemandList)    // Used in Moderator Panel to get unissued demand list of users
router.post('/company-unissuedDemandList',auth,productController.getUnissuedCompanyDemandList) // Used in Moderator Panel to get unissued company demand list
router.post('/filterProducts',auth,productController.filterProducts)               // Used in Moderator Panel to get filtered product for useer


router.post('/getOutOfStock',auth,productController.outOfStockCalculator)          // Used in Manager Panel to check for OUT OF STOCK product
router.post('/getProductReceived',auth,productController.productReceived)          // Used in User Panel to get product that issued to him
router.post('/getProductReport',auth,productController.allProductReport)




//For Sending CSV Files
router.post('/getStoreReportCSV',auth,productController.getstoreReportCSV);     // Used in Store Report panel to download CSV
router.post('/get-products-csv',productController.sendProductCSV)            // Used in all product report panel to get CSV



//For Receiving CSV Files
router.post('/upload-product-csv', upload.single('csvFile'), productController.receiveProductCSV); // Used to add product via CSV


// Operation routes
router.post('/add',auth,productController.addProduct);                         // Used in Admin Panel to add new product
router.post('/makeDemand',auth,productController.makeDemand);                   // Used in User Panel to raise a demand
router.post('/updateDemandStatus',auth,productController.updateDemandStatus);   // Used in Manager Panel to Approve/Reject Demand
router.post('/updateCompanyDemandStatus',auth,productController.updateCompanyDemandStatus);
router.post('/storeReport',auth,productController.storeReport);                 // Used in Admin Panel for store report table
router.post('/assignSingleProduct',auth,productController.assignSingleProduct); // Used in Moderator Panel to assign 1 product
router.post('/assignSingleCompanyProduct',auth,productController.assignSingleCompanyProduct);
router.post('/company-makeDemand',auth,productController.makeDemandCompany); 
router.post('/raiseTicket',auth,productController.raiseTicket);                 // Used in User & Company Panel to raise Ticket
router.post('/getAllTickets',auth,productController.getAllTickets);               // Used in Moderator Panel to get All Ticket
router.post('/updateTicket',auth,productController.updateTicketStatus); 

// router.post('/demandReport',productController.demandReport);            // Used in Admin/Manager Panel for demand report table

module.exports = router;
