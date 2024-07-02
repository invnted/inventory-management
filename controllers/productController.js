const Product = require('../models/Product');
const Demand = require('../models/Demand');
const csvParser = require('csv-parser');
const fs = require('fs');
const { createObjectCsvStringifier } = require('csv-writer');


function validateCSVHeadings(headings) {
  const validHeadings = [
    'productId',
    'productType',
    'productName',
    'productModel',
    'productBrand',
    'productPrice',
    'additionalDetail'
  ];

  for (let heading of headings) {
    if (!validHeadings.includes(heading)) {
      return false;
    }
  }
  return true;
}


exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    console.log(req.body)
    await product.save();
    console.log("Sucessfully added new product");
    res.status(200).json({success:true,product});

  } catch (err) {
    console.log("Error while adding product");
    res.status(500).json({ success: false, error: err.message });

  }
};

exports.getProductCSV = async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // Fetch all products from the database
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'productId', title: 'Product ID' },
        { id: 'productType', title: 'Product Type' },
        { id: 'productName', title: 'Product Name' },
        { id: 'productModel', title: 'Product Model' },
        { id: 'productBrand', title: 'Product Brand' },
        { id: 'productPrice', title: 'Product Price' },
        { id: 'additionalDetail', title: 'Additional Detail' }
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(products);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.status(200).send(csvData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const filePath = req.file.path; // Path of uploaded CSV file
    console.log("Uploaded file path:", filePath);

    // Read the CSV file and validate headings
    
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {

        // Validate CSV headings...
        const headings = Object.keys(results[0]);
        if (!validateCSVHeadings(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings. Must include productId, productType, productName, productModel, productBrand, productPrice, additionalDetail' });
        }

        // Processing each row... 
        results.forEach(async (row) => {
          try {
            const product = new Product(row);
            await product.save();
          } catch (err) {
            console.error('Error saving product from CSV:', err);
          }
        });

        res.status(200).json({ msg: 'CSV file uploaded and products added successfully' });
      });

  } catch (err) {
    console.error('Error uploading CSV:', err);
    res.status(500).json({ error: 'Failed to upload CSV file.' });
  }
};


exports.getAllProductsType = async (req, res) => {
  try {
    const productTypes = await Product.distinct('productType');
    console.log(productTypes);
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

      console.log(response); 
      response.success = true; 

      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.makeDemand = async (req, res) => {
  try {
    const demand = new Demand(req.body);
    console.log(req.body)

    await demand.save();
    console.log("Sucessfully added new demand");
    res.status(200).json({success:true});

  } catch (err) {
    console.log("Error while adding demand");
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserDemands = async (req, res) => {
  try {
    console.log("Get Demand Function called !")
    const { userId } = req.body; 
    console.log(userId)
    const userDemands = await Demand.find({ userId }).select('-userId -designation -additionalDetail -updatedAt');
    console.log(userDemands);
    
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
    console.log(demands);
    res.status(200).json({demands,success:true});
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingDemand = async (req, res) => {
  try {
    const demands = await Demand.find({ status: "PENDING" });
    console.log(demands);
    res.status(200).json({ demands, success: true });
  } catch (error) {
    console.error("Error fetching demands:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.storeReport = async (req, res) => {
  const { productType, productModel, productBrand, status, fromDate, toDate } = req.body;
  let query = {};
  
  if (productType) { query.productType = productType; }
  if (productModel) { query.productModel = productModel; }
  if (productBrand) { query.productBrand = productBrand; }
  if (status) { query.status = status; }
  
  if (fromDate && toDate) {
    
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    
    query.createdAt = { $gte: startDate, $lte: endDate };
  }

  try {
    const reports = await Product.find(query);
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Error fetching reports" });
  }
};

exports.getstoreCSV = async (req, res) => {
  try {
    const products = await Product.find({}).lean(); 
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'productId', title: 'Product ID' },
        { id: 'productType', title: 'Product Type' },
        { id: 'productName', title: 'Product Name' },
        { id: 'productModel', title: 'Product Model' },
        { id: 'productBrand', title: 'Product Brand' },
        { id: 'status', title: 'Product Status' },
       
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