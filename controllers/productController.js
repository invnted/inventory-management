const Product = require('../models/Product');
// const path = require('path');
// const fastcsv = require('fast-csv');
const Demand = require('../models/Demand');
// const csvParser = require('csv-parser');
// const fs = require('fs');
const { createObjectCsvStringifier } = require('csv-writer');

//CSV Locators
const { receiveProductCSV } = require('../csv_handlers/products/addProductCSV');

//CSV Caller
exports.receiveProductCSV = receiveProductCSV;


// function product_csv_valitdator(headings) {
//   const validHeadings = [
//     'productId',
//     'productType',
//     'productName',
//     'productModel',
//     'productBrand',
//     'productPrice',
//     'additionalDetail'
//   ];

//   for (let heading of headings) {
//     if (!validHeadings.includes(heading)) {
//       return false;
//     }
//   }
//   return true;
// }


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

// exports.sendProductCSV = async (req, res) => {
//   try {
//     const products = await Product.find({}).lean(); // Fetch all products from the database
//     const csvStringifier = createObjectCsvStringifier({
//       header: [
//         { id: 'productId', title: 'Product ID' },
//         { id: 'productType', title: 'Product Type' },
//         { id: 'productName', title: 'Product Name' },
//         { id: 'productModel', title: 'Product Model' },
//         { id: 'productBrand', title: 'Product Brand' },
//         { id: 'productPrice', title: 'Product Price' },
//         { id: 'additionalDetail', title: 'Additional Detail' }
//       ]
//     });

//     const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(products);
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
//     res.status(200).send(csvData);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.receiveProductCSV = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ msg: 'No file uploaded' });
//     }

//     const filePath = req.file.path; // Path of uploaded CSV file
//     console.log("Uploaded file path:", filePath);

//     // Read the CSV file and validate headings
//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on('data', (data) => results.push(data))
//       .on('end', () => {

//         // Validate CSV headings...
//         const headings = Object.keys(results[0]);
//         if (!product_csv_valitdator(headings)) {
//           console.log("Fail to upload due to invalid heading");
//           return res.status(400).json({ msg: 'Invalid CSV headings. Must include productId, productType, productName, productModel, productBrand, productPrice, additionalDetail' });
//         }

//         // Processing each row... 
//         results.forEach(async (row) => {
//           try {
//             const product = new Product(row);
//             await product.save();
//           } catch (err) {
//             console.error('Error saving product from CSV:', err);
//           }
//         });

//         res.status(200).json({ msg: 'CSV file uploaded and products added successfully' });
//       });

//   } catch (err) {
//     console.error('Error uploading CSV:', err);
//     res.status(500).json({ error: 'Failed to upload CSV file.' });
//   }
// };


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


exports.getAllDemand = async (req, res) => {
  try {
    const demands = await Demand.find({});
    res.status(200).json({demands,success:true});
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingDemand = async (req, res) => {
  try {
    const demands = await Demand.find({ status: "PENDING" });
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


exports.getstoreReportCSV = async (req, res) => {
  const { productType, productModel, productBrand, fromDate, toDate } = req.body;
  let query = {};

  if (productType) query.productType = productType;
  if (productModel) query.productModel = productModel;
  if (productBrand) query.productBrand = productBrand;

  if (fromDate && toDate) {
    try {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);

      if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
        throw new Error("Invalid date format");
      }

      query.createdAt = { $gte: startDate, $lte: endDate };
    } catch (err) {
      console.error("Error parsing dates:", err);
      return res.status(400).json({ error: "Invalid date format" });
    }
  }

  


  try {
    const products = await Product.find(query).lean();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'productType', title: 'Product Type' },
        { id: 'productModel', title: 'Product Model' },
        { id: 'productBrand', title: 'Product Brand' },
        { id: 'status', title: 'Product Status' },
        { id: 'createdAt', title: 'Date & Time' },
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(products);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=store_report.csv');
    res.status(200).send(csvData);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.filterProducts = async (req, res) => {
  const { productType, productModel, productBrand, quantity } = req.body;
  console.log(req.body);
  const issuedTo = 'NONE';
  let query = {}; // Initialize query with issuedTo condition
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

exports.outOfStockCalculator = async (req, res) => {
  console.log("Req come for Out of stock")
  try {
    // Aggregate demands by productType, productBrand, productModel
    const demands = await Demand.aggregate([
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
    ]);

    const outOfStockDemands = [];

    // Iterate through each demand to check against product inventory
    for (const demand of demands) {
      const { productType, productBrand, productModel } = demand._id;
      const totalDemandQuantity = demand.totalQuantity;

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
  
      return res.status(200).json({ outOfStockDemands, makeNotification:true, success:true });
    } else {
      return res.status(200).json({ message: 'All demands can be fulfilled with available stock.', makeNotification:false});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.productReceived = async (req, res) => {
  try {
    const { userId } = req.body;
    const products = await Product.find({ issuedTo: userId }, 'productId productType productName productBrand productModel updatedAt');
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this user.' });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};