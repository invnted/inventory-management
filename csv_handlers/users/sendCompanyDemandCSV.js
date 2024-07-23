const { createObjectCsvStringifier } = require('csv-writer'); // Ensure this import is correct
const companyDemand = require('../../models/companyDemand'); 

exports.sendCompanyDemandCSV = async (req, res) => {
  try {
    const demands = await companyDemand.find({}).lean(); // Fetch all users from the database

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'demandId', title: 'demandId' },
        { id: 'companyId', title: 'companyId' },
        { id: 'productType', title: 'productType' },
        { id: 'productName', title: 'productName' },
        { id: 'productBrand', title: 'productBrand' },
        { id: 'productModel', title: 'productModel' },
        { id: 'productQuantity', title: 'productQuantity' },
        { id: 'status', title: 'status' },
        { id: 'createdAt', title: 'createdAt' }
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(demands);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_users_list.csv');
    res.status(200).send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
};
