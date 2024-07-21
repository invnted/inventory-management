const { createObjectCsvStringifier } = require('csv-writer'); // Ensure this import is correct
const Moderator = require('../../models/Moderator'); 

exports.sendModeratorCSV = async (req, res) => {
  try {
    const moderators = await Moderator.find({}).lean(); // Fetch all moderators from the database

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'moderatorId', title: 'moderatorId' },
        { id: 'moderatorName', title: 'moderatorName' },
        { id: 'password', title: 'password' },
        { id: 'designation', title: 'designation' },
        { id: 'section', title: 'section' },
        { id: 'appointment', title: 'appointment' }
      ]
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(moderators);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_moderator_list.csv');
    res.status(200).send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
};
