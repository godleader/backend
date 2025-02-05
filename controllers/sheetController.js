// controllers/searchController.js

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Load configuration from environment variables (or your config)
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

// You can change this if your data is on a different sheet
const SHEET_INDEX = 0;

export const search = async (req, res) => {
  try {
    // Extract search parameters. You can also get these from req.query if you use GET.
    const { name, phone, idcard } = req.body;
    
    // Validate that at least one search parameter is provided
    if (!name && !phone && !idcard) {
      return res.status(400).json({ error: 'Please provide at least one search parameter (name, phone, or idcard).' });
    }
    
    // Initialize the Google Spreadsheet instance
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo(); // loads document properties and worksheets

    // Access the desired sheet (first sheet by default)
    const sheet = doc.sheetsByIndex[SHEET_INDEX];
    const rows = await sheet.getRows(); // get all rows in the sheet

    // Search the rows.
    // For this example we assume that the spreadsheet has column headers named exactly "name", "phone", and "idcard".
    // We use case-insensitive partial matching.
    const matchedRows = rows.filter(row => {
      let isMatch = true;
      if (name) {
        // Ensure the row has a "name" column and compare (case-insensitive, partial match)
        isMatch = isMatch && row.name && row.name.toLowerCase().includes(name.toLowerCase());
      }
      if (phone) {
        isMatch = isMatch && row.phone && row.phone.includes(phone);
      }
      if (idcard) {
        isMatch = isMatch && row.idcard && row.idcard.includes(idcard);
      }
      return isMatch;
    });

    // If no matches found, return a 404 error
    if (!matchedRows.length) {
      return res.status(404).json({ error: 'No matching records found.' });
    }

    // Return the matched rows (if you only expect one record, you could return matchedRows[0])
    return res.status(200).json({ data: matchedRows });
  } catch (error) {
    console.error('Error in searchData controller:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
