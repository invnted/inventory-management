const fs = require('fs');
const csvParser = require('csv-parser');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Moderator = require('../../models/Moderator'); 

function moderator_csv_validator(headings) {
  const validHeadings = [
    'moderatorId',
    'moderatorName',
    'email',
    'password',
    'designation',
    'section',
    'appointment'
  ];

  return validHeadings.every(heading => headings.includes(heading));
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
        if (results.length === 0) {
          return res.status(400).json({ msg: 'CSV file is empty' });
        }

        // Validate CSV headings
        const headings = Object.keys(results[0]);
        if (!moderator_csv_validator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings. Required headings are missing.' });
        }

        let addedCount = 0;
        let existingCount = 0;

        // Processing each row
        for (let row of results) {
          // Ensure each row has all required fields
          for (let heading of ['moderatorId', 'moderatorName', 'email', 'password', 'designation', 'section', 'appointment']) {
            if (row[heading] === undefined || row[heading] === null || row[heading].trim() === '') {
              console.log(`Skipping row with missing or empty ${heading}:`, row);
              return res.status(400).json({ msg: `CSV row missing or empty field: ${heading}` });
            }
          }

          // Hash the password before saving
          try {
            const salt = await bcrypt.genSalt(10);
            row.password = await bcrypt.hash(row.password, salt);
          } catch (err) {
            console.error('Error hashing password for row:', row);
            continue; // Skip to the next row if hashing fails
          }

          try {
            // Check if moderator already exists by moderatorId or email
            const existingModerator = await Moderator.findOne({
              $or: [
                { moderatorId: row.moderatorId },
                { email: row.email }
              ]
            });

            if (!existingModerator) {
              // Save new moderator if not exists
              const moderator = new Moderator(row);
              await moderator.save();
              addedCount++;
            } else {
              // Existing moderator found
              existingCount++;
            }
          } catch (err) {
            console.error('Error saving moderator from CSV:', err);
          }
        }

        res.status(200).json({ 
          msg: 'CSV file processed', 
          added: addedCount, 
          existing: existingCount 
        });
      });

  } catch (err) {
    console.error('Error uploading CSV:', err);
    res.status(500).json({ error: 'Failed to upload CSV file.' });
  }
};
