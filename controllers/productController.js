const Product = require('../models/Product');
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
// Add other CRUD operations (getProducts, updateProduct, deleteProduct, etc.)