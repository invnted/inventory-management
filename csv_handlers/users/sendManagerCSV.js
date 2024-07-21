const { createObjectCsvStringifier } = require('csv-writer'); // Ensure this import is correct
const Manager = require('../../models/Manager'); 

exports.sendManagerCSV = async (req, res) => {
  try {
    const managers = await Manager.find({}).lean(); // Fetch all managers from the database

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'managerId', title: 'managerId' },
        { id: 'managerName', title: 'managerName' },
        { id: 'password', title: 'password' },
        { id: 'designation', title: 'designation' },
        { id: 'section', title: 'section' },
        { id: 'appointment', title: 'appointment' },
        { id: 'allProductReport', title: 'allProductReport' },
        { id: 'demandReceived', title: 'demandReceived' },
        { id: 'issueProduct', title: 'issueProduct' }
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(managers);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_managers_list.csv');
    res.status(200).send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
};
