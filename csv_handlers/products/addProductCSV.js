const Product = require('../../models/Product');
const csvParser = require('csv-parser');
const fs = require('fs');
const { createObjectCsvStringifier } = require('csv-writer');




function product_csv_valitdator(headings) {
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


exports.receiveProductCSV = async (req, res) => {
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
          if (!product_csv_valitdator(headings)) {
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

