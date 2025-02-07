import { google } from 'googleapis';

/**
 * Searches a Google Spreadsheet for rows matching the provided keyword, country, and searchType.
 *
 * Expected POST body:
 * {
 *   "keyword": "some keyword",
 *   "country": "USA",
 *   "searchType": "exampleType"
 * }
 */
export const searchSheets = async (req, res) => {
  try {
    // Extract payload variables; currently only `name` is used for filtering.
    const { country, searchType, name } = req.body;

    // Validate the required parameter `name`
    if (!name) {
      return res.status(400).json({
        message: "Missing required parameter: name.",
      });
    }

    // Initialize Google Sheets API client using service account credentials.
    // The credentials are expected to be stored in the environment variable as a Base64 encoded string.
    const serviceAccountKey = Buffer
      .from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64')
      .toString('utf-8');

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Spreadsheet configuration
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = 'Sheet1!A1:Z1000'; // 根据实际情况调整范围

    // Retrieve data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found in the spreadsheet.' });
    }

    // Assume the first row contains headers: name, mobile, idCard
    const headers = rows[0];
    const nameIndex = headers.indexOf('name');

    if (nameIndex === -1) {
      return res.status(500).json({ message: 'Spreadsheet is missing required header "name".' });
    }

    // Filter rows: search in the "name" column using case-insensitive matching
    const filteredResults = rows.slice(1).filter((row) => {
      const rowName = row[nameIndex] || '';
      return rowName.toLowerCase().includes(name.toLowerCase());
    });

    return res.status(200).json({ data: filteredResults });
  } catch (error) {
    console.error("Error searching spreadsheet:", error);
    return res.status(500).json({
      message: "Error searching spreadsheet",
      error: error.message,
    });
  }
};