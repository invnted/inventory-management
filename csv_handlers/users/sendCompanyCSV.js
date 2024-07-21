const { createObjectCsvStringifier } = require('csv-writer'); // Ensure this import is correct
const Company = require('../../models/Company'); 

exports.sendCompanyCSV = async (req, res) => {
  try {
    const companies = await Company.find({}).lean(); // Fetch all companies from the database

    // Remove password field from each company object
    const companiesWithoutPassword = companies.map(company => {
      const { password, ...companyWithoutPassword } = company;
      return companyWithoutPassword;
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'companyId', title: 'companyId' },
        { id: 'companyName', title: 'companyName' },
        { id: 'email', title: 'email' },
        { id: 'alternativeEmail', title: 'alternativeEmail' },
        { id: 'contact_1', title: 'contact_1' },
        { id: 'contact_2', title: 'contact_2' }
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(companiesWithoutPassword);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_companies_list.csv');
    res.status(200).send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
};
