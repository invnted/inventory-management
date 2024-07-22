const { createObjectCsvStringifier } = require('csv-writer'); // Ensure this import is correct
const Product = require('../../models/Product'); 

exports.sendProductCSV = async (req, res) => {
  console.log("Req for csv")
  try {
    const products = await Product.find({}).lean(); // Fetch all products from the database

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'productId', title: 'productId' },
        { id: 'productType', title: 'productType' },
        { id: 'productName', title: 'productName' },
        { id: 'productModel', title: 'productModel' },
        { id: 'productBrand', title: 'productBrand' },
        { id: 'productPrice', title: 'productPrice' },
        { id: 'issuedTo', title: 'issuedTo' },
        { id: 'status', title: 'status' },
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(products);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_products_list.csv');
    res.status(200).send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
};
