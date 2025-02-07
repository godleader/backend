import { google } from 'googleapis';

export const searchSheets = async (req, res) => {
  try {
    const SHEET_ID_CN = '1wtRzLVkd2tA1SUNUXUoGjcHxYDBuKtD_zRT65sIgF_k';
    const SHEET_ID_US = process.env.GOOGLE_SPREADSHEET_ID_COUNTRY_US;
    const SHEET_ID_KR = process.env.GOOGLE_SPREADSHEET_ID_COUNTRY_KR;

    const { country, searchType, keyword } = req.body;

    // Validate required parameters
    if (!keyword) {
      return res.status(400).json({ message: "Missing required parameter: keyword." });
    }
    if (!searchType) {
      return res.status(400).json({ message: "Missing required parameter: searchType." });
    }
    if (!country) {
      return res.status(400).json({ message: "Missing required parameter: country." });
    }


    // Determine Spreadsheet ID based on country
    let spreadsheetId;
    switch (country) {
      case 'cn':
        spreadsheetId = SHEET_ID_CN;
        break;
      case 'us':
        spreadsheetId = SHEET_ID_US;
        break;
      case 'kr':
        spreadsheetId = SHEET_ID_KR;
        break;
      default:
        return res.status(400).json({ error: 'Spreadsheet not found for this country.' });
    }

    // Initialize Google Sheets API client
    const serviceAccountKey = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8')); // Parse JSON

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });  // Corrected: No ss.getActiveSheet here

    const range = 'Sheet1!A1:Z1000'; // Adjust the range as needed

    // Retrieve data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found in the spreadsheet.' });
    }

    const headers = rows[0];

    // Determine column index based on searchType
    const columnIndex = headers.indexOf(searchType); // Simplified

    if (columnIndex === -1) {
      return res.status(400).json({ message: `Spreadsheet is missing the required header for ${searchType}.` }); // 400 Bad Request
    }

    const filteredResults = rows.slice(1).filter((row) => {
      const cellValue = row[columnIndex] || '';
      return cellValue.toLowerCase().includes(keyword.toLowerCase());
    });

    return res.status(200).json({ data: filteredResults });

  } catch (error) {
    console.error("Error searching spreadsheet:", error);
    return res.status(500).json({
      message: "Error searching spreadsheet",
      error: error.message,  // Include the error message for debugging
    });
  }
};