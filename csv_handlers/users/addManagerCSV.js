const fs = require('fs');
const csvParser = require('csv-parser');
const Manager = require('../../models/Manager'); 

function manager_csv_valitdator(headings) {
  const validHeadings = [
    'managerId',
    'managerName',
    'password',
    'designation',
    'section',
    'appointment',
    'allProductReport',
    'demandReceived',
    'issueProduct'
  ];

  for (let heading of headings) {
    if (!validHeadings.includes(heading)) {
      return false;
    }
  }
  return true;
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
        // Validate CSV headings...
        const headings = Object.keys(results[0]);
        if (!manager_csv_valitdator(headings)) {
          console.log("Fail to upload due to invalid heading");
          return res.status(400).json({ msg: 'Invalid CSV headings' });
        }

        // Processing each row... 
        for (let row of results) {
            // Convert strings to boolean values
            row.allProductReport = row.allProductReport.trim().toLowerCase() === 'true';
            row.demandReceived = row.demandReceived.trim().toLowerCase() === 'true';
            row.issueProduct = row.issueProduct.trim().toLowerCase() === 'true';
          
            try {
              const manager = new Manager(row);
              await manager.save();
            } catch (err) {
              console.error('Error saving manager from CSV:', err);
            }
          }
          

        res.status(200).json({ msg: 'CSV file uploaded and managers added successfully' });
      });

  } catch (err) {
    console.error('Error uploading CSV:', err);
    res.status(500).json({ error: 'Failed to upload CSV file.' });
  }
};
