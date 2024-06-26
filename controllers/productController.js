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

  
 
 