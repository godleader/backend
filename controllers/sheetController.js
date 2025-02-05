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
    const { keyword, country, searchType } = req.body;

    // Validate required parameters
    if (!keyword || !country || !searchType) {
      return res.status(400).json({
        message: "Missing required parameters: keyword, country, or searchType.",
      });
    }

    // Initialize Google Sheets API client with service account credentials
    const serviceAccountKey = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });


    // Spreadsheet configuration
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = 'Sheet1!A1:Z1000'; // Adjust range as needed

    // Retrieve data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found in the spreadsheet.' });
    }

    // Assume the first row contains headers (e.g., Country, Keyword, SearchType)
    const headers = rows[0];
    const countryIndex = headers.indexOf('Country');
    const keywordIndex = headers.indexOf('Keyword');
    const searchTypeIndex = headers.indexOf('SearchType');

    // Ensure required columns exist
    if (countryIndex === -1 || keywordIndex === -1 || searchTypeIndex === -1) {
      return res.status(500).json({ message: 'Spreadsheet is missing required headers.' });
    }

    // Filter rows based on search criteria
    const filteredResults = rows.slice(1).filter((row) => {
      const rowCountry = row[countryIndex] || '';
      const rowKeyword = row[keywordIndex] || '';
      const rowSearchType = row[searchTypeIndex] || '';

      return (
        rowCountry.toLowerCase() === country.toLowerCase() &&
        rowKeyword.toLowerCase().includes(keyword.toLowerCase()) &&
        rowSearchType.toLowerCase() === searchType.toLowerCase()
      );
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
