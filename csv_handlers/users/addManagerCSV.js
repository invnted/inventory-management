const fs = require('fs');
const csvParser = require('csv-parser');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Manager = require('../../models/Manager'); 

function manager_csv_validator(headings) {
  const validHeadings = [
    'managerId',
    'managerName',
    'email',
    'password',
    'designation',
    'section',
    'appointment',
    'allProductReport',
    'demandReceived',
    'issueProduct'
  ];

  // Check if all valid headings are present in the CSV
  return validHeadings.every(heading => headings.includes(heading));
}

exports.receiveManagerCSV = async (req, res) => {
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
        if (!manager_csv_validator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings. Required headings are missing.' });
        }

        // Processing each row... 
        let addedCount = 0;
        let existingCount = 0;

        for (let row of results) {
          // Ensure each row has all required fields
          for (let heading of ['managerId', 'managerName', 'email', 'password', 'designation', 'section', 'appointment', 'allProductReport', 'demandReceived', 'issueProduct']) {
            if (row[heading] === undefined || row[heading] === null || row[heading].trim() === '') {
              console.log(`Skipping row with missing or empty ${heading}:`, row);
              return res.status(400).json({ msg: `CSV row missing or empty field: ${heading}` });
            }
          }

          // Convert strings to boolean values
          row.allProductReport = row.allProductReport.trim().toLowerCase() === 'true';
          row.demandReceived = row.demandReceived.trim().toLowerCase() === 'true';
          row.issueProduct = row.issueProduct.trim().toLowerCase() === 'true';

          // Hash the password before saving
          try {
            const salt = await bcrypt.genSalt(10);
            row.password = await bcrypt.hash(row.password, salt);
          } catch (err) {
            console.error('Error hashing password for row:', row);
            continue; // Skip to the next row if hashing fails
          }

          try {
            // Check if manager already exists by managerId or email
            const existingManager = await Manager.findOne({
              $or: [
                { managerId: row.managerId },
                { email: row.email }
              ]
            });

            if (!existingManager) {
              // Save new manager if not exists
              const manager = new Manager(row);
              await manager.save();
              addedCount++;
            } else {
              // Existing manager found
              existingCount++;
            }
          } catch (err) {
            console.error('Error saving manager from CSV:', err);
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
