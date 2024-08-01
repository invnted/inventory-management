const fs = require('fs');
const csvParser = require('csv-parser');
const bcrypt = require('bcrypt');
const Company = require('../../models/Company'); // Adjust according to your model path

function company_csv_validator(headings) {
  const validHeadings = [
    'companyId',
    'companyName',
    'email',
    'password',
    'alternativeEmail',
    'contact_1',
    'contact_2'
  ];

  return validHeadings.every(heading => headings.includes(heading));
}

exports.receiveCompanyCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const filePath = req.file.path; // Path of uploaded CSV file
    console.log("Uploaded file path:", filePath);

    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        if (results.length === 0) {
          return res.status(400).json({ msg: 'CSV file is empty' });
        }

        const headings = Object.keys(results[0]);
        if (!company_csv_validator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings. Required headings are missing.' });
        }

        let addedCount = 0;
        let existingCount = 0;

        for (let row of results) {
          // Validate each row
          for (let heading of ['companyId', 'companyName', 'email', 'password', 'alternativeEmail', 'contact_1', 'contact_2']) {
            if (row[heading] === undefined || row[heading] === null || row[heading].trim() === '') {
              console.log(`Skipping row with missing or empty ${heading}:`, row);
              continue;
            }
          }

          // Hash the password
          try {
            const salt = await bcrypt.genSalt(10);
            row.password = await bcrypt.hash(row.password.trim(), salt);
          } catch (err) {
            console.error('Error hashing password for row:', row);
            continue;
          }

          // Check for existing company
          try {
            const existingCompany = await Company.findOne({ email: row.email });
            if (!existingCompany) {
              const company = new Company(row);
              await company.save();
              addedCount++;
            } else {
              existingCount++;
            }
          } catch (err) {
            console.error('Error saving company from CSV:', err);
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
