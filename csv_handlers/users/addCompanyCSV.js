const fs = require('fs');
const csvParser = require('csv-parser');
const bcrypt = require('bcrypt');
const Company = require('../../models/Company'); 

function company_csv_valitdator(headings) {
  const validHeadings = [
    'companyId',
    'companyName',
    'email',
    'password',
    'alternativeEmail',
    'contact_1',
    'contact_2'
  ];

  for (let heading of headings) {
    if (!validHeadings.includes(heading)) {
      return false;
    }
  }
  return true;
}

exports.receiveCompanyCSV = async (req, res) => {
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
        if (!company_csv_valitdator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings' });
        }

        // Processing each row... 
        for (let row of results) {
          try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            row.password = await bcrypt.hash(row.password, salt);

            const company = new Company(row);
            await company.save();
          } catch (err) {
            console.error('Error saving Company from CSV:', err);
          }
        }

        res.status(200).json({ msg: 'CSV file uploaded and companies added successfully' });
      });

  } catch (err) {
    console.error('Error uploading CSV:', err);
    res.status(500).json({ error: 'Failed to upload CSV file.' });
  }
};
