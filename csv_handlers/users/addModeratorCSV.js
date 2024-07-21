const fs = require('fs');
const csvParser = require('csv-parser');
const Moderator = require('../../models/Moderator'); 

function moderator_csv_valitdator(headings) {
  const validHeadings = [
    'moderatorId',
    'moderatorName',
    'password',
    'designation',
    'section',
    'appointment'
  ];

  for (let heading of headings) {
    if (!validHeadings.includes(heading)) {
      return false;
    }
  }
  return true;
}

exports.receiveModeratorCSV = async (req, res) => {
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
      .on('end', async () => {
        // Validate CSV headings...
        const headings = Object.keys(results[0]);
        if (!moderator_csv_valitdator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings' });
        }

        // Processing each row... 
        for (let row of results) {
            try {
              const moderator = new Moderator(row);
              await moderator.save();
            } catch (err) {
              console.error('Error saving moderator from CSV:', err);
            }
          }
          

        res.status(200).json({ msg: 'CSV file uploaded and moderators added successfully' });
      });

  } catch (err) {
    console.error('Error uploading CSV:', err);
    res.status(500).json({ error: 'Failed to upload CSV file.' });
  }
};
