const fs = require('fs');
const csvParser = require('csv-parser');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../../models/User'); // Adjust according to your model path

function user_csv_validator(headings) {
  const validHeadings = [
    'userId',
    'userName',
    'email',
    'password',
    'designation',
    'section',
    'appointment',
  ];

  return validHeadings.every(heading => headings.includes(heading));
}

exports.receiveUserCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const filePath = req.file.path; 
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
        if (!user_csv_validator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings. Required headings are missing.' });
        }

        let addedCount = 0;
        let existingCount = 0;

        for (let row of results) {
          for (let heading of ['userId', 'userName', 'email', 'password', 'designation', 'section', 'appointment']) {
            if (row[heading] === undefined || row[heading] === null || row[heading].trim() === '') {
              console.log(`Skipping row with missing or empty ${heading}:`, row);
              return res.status(400).json({ msg: `CSV row missing or empty field: ${heading}` });
            }
          }

          row.password = row.password.trim();
          try {
            const salt = await bcrypt.genSalt(10);
            row.password = await bcrypt.hash(row.password, salt);
          } catch (err) {
            console.error('Error hashing password for row:', row);
            continue;
          }

          try {
            const existingUser = await User.findOne({ email: row.email });
            if (!existingUser) {
              const user = new User(row);
              await user.save();
              addedCount++;
            } else {
              existingCount++;
            }
          } catch (err) {
            console.error('Error saving user from CSV:', err);
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
