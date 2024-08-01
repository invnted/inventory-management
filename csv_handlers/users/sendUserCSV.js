const { createObjectCsvStringifier } = require('csv-writer'); // Ensure this import is correct
const User = require('../../models/User'); 

exports.sendUserCSV = async (req, res) => {
  try {
    const users = await User.find({}).lean(); // Fetch all users from the database

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'userId', title: 'userId' },
        { id: 'userName', title: 'userName' },
        { id: 'email', title: 'email' },
        { id: 'designation', title: 'designation' },
        { id: 'section', title: 'section' },
        { id: 'appointment', title: 'appointment' }
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(users);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_users_list.csv');
    res.status(200).send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
};
