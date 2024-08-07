const Product = require('../models/Product');
const Demand = require('../models/Demand');
const companyDemand = require('../models/companyDemand');
const Ticket = require('../models/Ticket');
const { createObjectCsvStringifier } = require('csv-writer');


//CSV Locators
const { receiveProductCSV } = require('../csv_handlers/products/addProductCSV');
const { sendProductCSV } = require('../csv_handlers/products/sendProductCSV');
const { sendStoreReportCSV } = require('../csv_handlers/products/storeReportCSV');

//CSV Caller
exports.receiveProductCSV = receiveProductCSV;
exports.sendProductCSV = sendProductCSV;
exports.sendStoreReportCSV = sendStoreReportCSV;


exports.addProduct = async (req, res) => {
  try {
    // Convert specific fields to lowercase
    const lowercaseFields = ['productType', 'productName', 'productModel', 'productBrand', 'additionalDetail' , /* add other fields here */];
    lowercaseFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = req.body[field].toLowerCase();
      }
    });

    // Create new Product instance using req.body
    const product = new Product(req.body);
    await product.save();
    
    console.log("Successfully added new product");
    res.status(200).json({ success: true, product });

  } catch (err) {
    console.error("Error while adding product:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getAllProductsType = async (req, res) => {
  try {
    const productTypes = await Product.distinct('productType');
    res.status(200).json(productTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const productTypes = await Product.distinct('productType');
    const productsDetails = await Promise.all(
      productTypes.map(async (type) => {
        const products = await Product.find({ productType: type });
        return {
          productType: type,
          details: products.map(product => ({
            productName: product.productName,
            productModel: product.productModel,
            productBrand: product.productBrand,
          }))
        };
      })
    );
    res.status(200).json(productsDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.NEW_getAllProducts = async (req, res) => {
  try {
    // Fetch all distinct product types
    const productTypes = await Product.distinct('productType');

    // Create an object to store the structured data
    const productsDetails = {};

    // Iterate over each product type to fetch and organize product details
    for (const type of productTypes) {
      const products = await Product.find({ productType: type }).exec();

      // Initialize the product type in the result object if it doesn't exist
      if (!productsDetails[type]) {
        productsDetails[type] = {};
      }

      // Group products by product brand
      products.forEach(product => {
        const { productBrand, productModel, productName } = product;

        // Initialize the product brand in the result object if it doesn't exist
        if (!productsDetails[type][productBrand]) {
          productsDetails[type][productBrand] = {};
        }

        // Initialize the product name in the result object if it doesn't exist
        if (!productsDetails[type][productBrand][productName]) {
          productsDetails[type][productBrand][productName] = [];
        }

        // Add the product model to the product name array if it doesn't exist
        if (!productsDetails[type][productBrand][productName].includes(productModel)) {
          productsDetails[type][productBrand][productName].push(productModel);
        }
      });
    }

    // Format the data to the desired structure
    const formattedData = Object.keys(productsDetails).map(type => ({
      productType: type,
      brands: Object.keys(productsDetails[type]).map(brand => ({
        productBrand: brand,
        products: Object.keys(productsDetails[type][brand]).map(productName => ({
          productName: productName,
          models: productsDetails[type][brand][productName]
        }))
      }))
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductStore = async (req, res) => {
  const { productType } = req.body;
  try {
      const result = await Product.aggregate([
          { $match: { productType } },
          {
              $group: {
                  _id: "$status",
                  count: { $sum: 1 }
              }
          },
          {
              $group: {
                  _id: null,
                  statusCounts: {
                      $push: {
                          status: "$_id",
                          count: "$count"
                      }
                  },
                  totalProducts: { $sum: "$count" }
              }
          }
      ]);

     
      let response = {
          totalProducts: "0",
          HELD: "0",
          ISSUED: "0",
          SERVICEABLE: "0",
          UNSERVICEABLE: "0",
          BER: "0"
      };

      if (result.length > 0) {
          result[0].statusCounts.forEach(status => {
              response[status.status] = status.count.toString();
          });
          response.totalProducts = result[0].totalProducts.toString();
      }
      response.success = true; 

      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.makeDemand = async (req, res) => {
  console.log(req.body)
  try {
  
    // Convert specific fields to lowercase
    const lowercaseFields = ['productType', 'productName', 'productModel', 'productBrand', 'additionalDetail' , /* add other fields here */];
    lowercaseFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = req.body[field].toLowerCase();
      }
    });

    const demand = new Demand(req.body);
    await demand.save();
    console.log("Successfully added new demand");
    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Error while adding demand:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserDemands = async (req, res) => {
  try {
    const { userId } = req.body;
    const userDemands = await Demand.find({ userId }).select('-userId -designation -additionalDetail -updatedAt');
    // Map userDemands to format the response as needed
    const formattedDemands = userDemands.map(demand => ({
      demandId: demand.demandId, 
      productType: demand.productType,
      productName: demand.productName,
      productModel: demand.productModel,
      productBrand: demand.productBrand,
      productQuantity: demand.productQuantity,
      status: demand.status,
      createdAt: demand.createdAt
    }));

    res.status(200).json({
      success: true,
      message: "User demands fetched successfully",
      data: formattedDemands
    });
  } catch (error) {
    console.error("Error fetching user demands:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user demands",
      error: error.message
    });
  }
};

exports.getCompanyDemands = async (req, res) => {
  try {
    const { companyId } = req.body;
    const companyDemands = await companyDemand.find({ companyId }).select('-companyId -additionalDetail -updatedAt');
    // Map userDemands to format the response as needed
    const formattedDemands = companyDemands.map(demand => ({
      demandId: demand.demandId, 
      productType: demand.productType,
      productName: demand.productName,
      productModel: demand.productModel,
      productBrand: demand.productBrand,
      productQuantity: demand.productQuantity,
      status: demand.status,
      createdAt: demand.createdAt
    }));

    res.status(200).json({
      success: true,
      message: "User demands fetched successfully",
      data: formattedDemands
    });
  } catch (error) {
    console.error("Error fetching user demands:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user demands",
      error: error.message
    });
  }
};

exports.getAllDemand = async (req, res) => {
  try {
    const demands = await Demand.find({});
    res.status(200).json({demands,success:true});
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.allCompanyDemand = async (req, res) => {
  try {
    const demands = await companyDemand.find({});
    res.status(200).json({demands,success:true});
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPendingDemand = async (req, res) => {
  try {
    const demands = await Demand.find({ status: "PENDING" });
    res.status(200).json({ demands, success: true });
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyPendingDemand = async (req, res) => {
  try {
    const demands = await companyDemand.find({ status: "PENDING" });
    res.status(200).json({ demands, success: true });
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.storeReport = async (req, res) => {
  const { productName, productType, productModel, productBrand, fromDate, toDate } = req.body;
  let query = {};

  if (productName) { query.productName = productName; }
  if (productType) { query.productType = productType; }
  if (productModel) { query.productModel = productModel; }
  if (productBrand) { query.productBrand = productBrand; }

  if (fromDate && toDate) {
    try {
      // Parse fromDate and toDate into Date objects
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Check if parsing was successful
      if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
        throw new Error("Invalid date format");
      }

      // Adjust endDate to include the entire day
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      // Create date range query for createdAt field
      query.createdAt = { $gte: startDate, $lte: endDate };

    } catch (err) {
      console.error("Error parsing dates:", err);
      return res.status(400).json({ error: "Invalid date format" });
    }
  }

  try {
    const reports = await Product.find(query);

    

    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Error fetching reports" });
  }
};

exports.updateDemandStatus = async (req, res) => {                //UPADTE ATTRIBUTES: APPROVED, REJECTED
  try {
    const { demandId, status } = req.body;

    const updatedDemand = await Demand.findOneAndUpdate(
      { demandId: demandId }, 
      { status: status }, 
      { new: true, runValidators: true }
    );

    if (!updatedDemand) {
      return res.status(404).json({ success: false, message: 'Demand not found' });
    }

    console.log("Successfully updated demand status");
    res.status(200).json({ success: true, status: updatedDemand.status });

  } catch (err) {
    console.log("Error while updating demand status", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateCompanyDemandStatus = async (req, res) => {                //UPADTE ATTRIBUTES: APPROVED, REJECTED
  try {
    const { demandId, status } = req.body;

    const updatedDemand = await companyDemand.findOneAndUpdate(
      { demandId: demandId }, 
      { status: status }, 
      { new: true, runValidators: true }
    );

    if (!updatedDemand) {
      return res.status(404).json({ success: false, message: 'Demand not found' });
    }

    console.log("Successfully updated demand status");
    res.status(200).json({ success: true, status: updatedDemand.status });

  } catch (err) {
    console.log("Error while updating demand status", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.productTypesInDemand = async (req, res) => {
  try {
    const { userId } = req.body; 
    const productTypes = await Demand.distinct('productType', { userId });
    res.status(200).json(productTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnissuedDemandList = async (req, res) => {
  try {
    const demands = await Demand.find({ status: "APPROVED" });
    res.status(200).json({ demands, success: true });
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUnissuedCompanyDemandList = async (req, res) => {
  try {
    const demands = await companyDemand.find({ status: "APPROVED" });
    res.status(200).json({ demands, success: true });
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  const { productType, productModel, productBrand, quantity } = req.body;
  console.log(req.body);
  const issuedTo = 'NONE';
  let query = {}; 
  if (productType) query.productType = productType;
  if (productModel) query.productModel = productModel;
  if (productBrand) query.productBrand = productBrand;
  query.issuedTo = issuedTo;

  // console.log("Filter Query: ",query)

  try {
    const filteredProducts = await Product.find(query);
    const limitedProducts = filteredProducts.slice(0, quantity);
    console.log("Returning: ", limitedProducts);

    res.status(200).json({ filteredProducts: limitedProducts, success: true });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.assignSingleProduct = async (req, res) => {
  const { productId, userId, demandId } = req.body;

  console.log(req.body)

  try {
    // Fetch the Demand document
    let demand = await Demand.findOne({ demandId });
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Demand not found' });
    }

    // Check if productQuantity is greater than zero
    if (demand.productQuantity > 0) {
      // Decrement productQuantity by one
      demand.productQuantity -= 1;

      // If productQuantity reaches zero, update the status to COMPLETED
      if (demand.productQuantity === 0) {
        demand.status = 'COMPLETED';
      }

      // Save the updated Demand document
      await demand.save();
    } else {
      return res.status(400).json({ success: false, message: 'No remaining product quantity in the demand' });
    }

    // Find the product
    let product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update the product document with the new fields
    const updateFields = { issuedTo: userId, status: 'ISSUED' };
    product = await Product.findOneAndUpdate(
      { productId },
      { $set: updateFields },
      { new: true }
    );

    res.json({ success: true, product, demand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



exports.assignSingleCompanyProduct = async (req, res) => {
  const { productId, companyId, demandId } = req.body;

  console.log(req.body)

  try {
    // Fetch the Demand document
    let demand = await companyDemand.findOne({ demandId });
    if (!demand) {
      return res.status(404).json({ success: false, message: 'Demand not found' });
    }

    // Check if productQuantity is greater than zero
    if (demand.productQuantity > 0) {
      // Decrement productQuantity by one
      demand.productQuantity -= 1;

      // If productQuantity reaches zero, update the status to COMPLETED
      if (demand.productQuantity === 0) {
        demand.status = 'COMPLETED';
      }

      // Save the updated Demand document
      await demand.save();
    } else {
      return res.status(400).json({ success: false, message: 'No remaining product quantity in the demand' });
    }

    // Find the product
    let product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update the product document with the new fields
    const updateFields = { issuedTo: companyId, status: 'ISSUED' };
    product = await Product.findOneAndUpdate(
      { productId },
      { $set: updateFields },
      { new: true }
    );

    res.json({ success: true, product, demand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.outOfStockCalculator = async (req, res) => {
  console.log("Request received for Out of Stock calculation");

  try {
    // Aggregate demands by productType, productBrand, productModel from both Demand and companyDemand collections
    const demandAggregation = [
      {
        $group: {
          _id: {
            productType: '$productType',
            productBrand: '$productBrand',
            productModel: '$productModel',
          },
          totalQuantity: { $sum: '$productQuantity' },
        },
      },
    ];

    const demandsFromDemand = await Demand.aggregate(demandAggregation);
    const demandsFromCompanyDemand = await companyDemand.aggregate(demandAggregation);

    // Combine demands from both collections
    const combinedDemands = {};

    demandsFromDemand.forEach(demand => {
      const key = JSON.stringify(demand._id);
      if (!combinedDemands[key]) {
        combinedDemands[key] = { ...demand._id, totalQuantity: 0 };
      }
      combinedDemands[key].totalQuantity += demand.totalQuantity;
    });

    demandsFromCompanyDemand.forEach(demand => {
      const key = JSON.stringify(demand._id);
      if (!combinedDemands[key]) {
        combinedDemands[key] = { ...demand._id, totalQuantity: 0 };
      }
      combinedDemands[key].totalQuantity += demand.totalQuantity;
    });

    const outOfStockDemands = [];

    // Iterate through each combined demand to check against product inventory
    for (const key in combinedDemands) {
      const demand = combinedDemands[key];
      const { productType, productBrand, productModel, totalQuantity: totalDemandQuantity } = demand;

      // Fetch total quantity of products from Product collection
      const totalProductQuantity = await Product.aggregate([
        {
          $match: {
            productType,
            productBrand,
            productModel,
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: 1 },
          },
        },
      ]);

      const availableQuantity = totalProductQuantity.length > 0 ? totalProductQuantity[0].totalQuantity : 0;
      if (totalDemandQuantity > availableQuantity) {
        outOfStockDemands.push({
          productType,
          productBrand,
          productModel,
          totalDemandQuantity,
          availableQuantity,
        });
      }
    }

    if (outOfStockDemands.length > 0) {
      return res.status(200).json({ outOfStockDemands, makeNotification: true, success: true });
    } else {
      return res.status(200).json({ message: 'All demands can be fulfilled with available stock.', makeNotification: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.productReceived = async (req, res) => {
  try {
    const { userId } = req.body;

    // Step 1: Fetch all products assigned to the user
    const products = await Product.find({ issuedTo: userId }, 'productId productType productName productBrand productModel updatedAt');

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this user.' });
    }

    // Step 2: Fetch ticket statuses for the user's products
    const productsWithTicketStatus = await Promise.all(products.map(async (product) => {
      // Find the ticket associated with the product and issuedBy
      const ticket = await Ticket.findOne({ productId: product.productId, issuedBy: userId });

      // Determine the ticket status

      // console.log("Value of ticket: ",ticket);

      let ticketStatus = 'NOT RAISED'; // Default status if no ticket is found
      if (ticket) {
        ticketStatus = ticket.status; // Use the status from the ticket
      }

      // Return product with ticket status
      return {
        ...product.toObject(),
        ticketStatus
      };
    }));
    console.log(productsWithTicketStatus);
    return res.status(200).json({ products: productsWithTicketStatus, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.allProductReport = async (req, res) => {
  try{
    const products = await Product.find({});
    return res.status(200).json({products, success:true});
  }
  catch (error){
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.makeDemandCompany = async (req, res) => {
  console.log(req.body);
  try {
  
    // Convert specific fields to lowercase
    const lowercaseFields = ['productType', 'productName', 'productModel', 'productBrand', 'additionalDetail' , /* add other fields here */];
    lowercaseFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = req.body[field].toLowerCase();
      }
    });

    const demand = new companyDemand(req.body);
    await demand.save();
    console.log("Successfully added new demand");
    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Error while adding demand:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.raiseTicket = async (req, res) => {
  const { ticketId, issueType, message, issuedBy, productId } = req.body;

  try {
    // Convert specific fields to lowercase
    const lowercaseFields = ['issueType', 'message'];
    lowercaseFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = req.body[field].toLowerCase();
      }
    });

    // Check if a ticket already exists for the given productId
    const existingTicket = await Ticket.findOne({ productId: productId });

    if (existingTicket) {
      return res.status(400).json({ success: false, message: 'Product ticket already exits.' });
    }

    // Create and save the new ticket
    const ticket = new Ticket(req.body);
    await ticket.save();
    console.log("Ticket Raised Successfully");
    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Error while raising ticket:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: { $ne: 'RESOLVED' } });
    return res.status(200).json({ tickets, success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}


exports.updateTicketStatus = async (req, res) => {
  const { ticketId, status } = req.body;
  console.log(req.body);

  if (!ticketId) {
    console.log("Ticket Id not found");
    return res.status(400).json({ msg: 'Ticket ID is required' });
  }

  if (status !== 'UNDER REVIEW' && status !== 'RESOLVED') {
    console.log("status not correct");
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    // Find the ticket by ticketId
    let ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      console.log("Ticket not found");
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    if (status === 'RESOLVED') {
      // Delete the ticket if status is "RESOLVED"
      await Ticket.findOneAndDelete({ ticketId });

      // Update the ticketStatus in the Product model
      await Product.findOneAndUpdate(
        { productId: ticket.productId },
        { $set: { ticketStatus: 'UNRAISED' } }
      );

      return res.json({ success: true, msg: 'Ticket resolved and removed successfully' });
    } else {
      // Update the ticket document with the new status
      ticket = await Ticket.findOneAndUpdate(
        { ticketId },
        { $set: { status } },
        { new: true }
      );

      res.json({ ticket, success: true });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.issueReport = async (req, res) => {
  
  try {
    const issueList = await Product.find({
      status: 'ISSUED',
      issueTo: { $ne: 'NONE' }
    });

    console.log(issueList);
    return res.status(200).json({ issueList, success:true });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};




