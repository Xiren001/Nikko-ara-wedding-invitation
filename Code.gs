// This is the code for your Google Apps Script project.
// 1. Create a new Google Sheet.
// 2. In the sheet, go to Extensions > Apps Script.
// 3. Replace the code in Code.gs with this code.
// 4. In the spreadsheet, create a sheet named "RSVPs".
// 5. Add the following headers in the first row of the "RSVPs" sheet:
//    Timestamp, Full Name, Email, Number of Guests, Attending, Message
// 6. At the top of the script editor, click "Deploy" > "New deployment".
// 7. For "Select type", choose "Web app".
// 8. In the "Configuration" section:
//    - Give your deployment a description (e.g., "RSVP Form v1").
//    - For "Execute as", select "Me".
//    - For "Who has access", select "Anyone". This is important for a public form.
// 9. Click "Deploy".
// 10. Authorize the script when prompted. It will need permission to access your Google Sheets.
// 11. Copy the "Web app URL" provided after deployment. It will end in /exec.
// 12. Paste this new URL into your index.html file as the value for the `scriptURL` constant.

// NOTE: The SPREADSHEET_ID is found in the URL of your Google Sheet. It is 44 characters long.
// e.g., if your sheet URL is https://docs.google.com/spreadsheets/d/12345ABC-d_EfGhIjKlMnOpQrStUvWxYzAbCdEfGhI/edit
// Then your SPREADSHE-ET_ID is '12345ABC-d_EfGhIjKlMnOpQrStUvWxYzAbCdEfGhI'
var SPREADSHEET_ID = "REPLACE_WITH_YOUR_SPREADSHEET_ID";
var SHEET_NAME = "RSVPs";

// This function handles POST requests from your form
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // Wait 30 seconds for others to finish.

  try {
    var sheet =
      SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    // The parameters from the form
    var name = e.parameter["name"];
    var email = e.parameter["email"];
    var guests = e.parameter["guests"];
    var attending = e.parameter["attending"];
    var message = e.parameter["message"];

    var newRow = [new Date(), name, email, guests, attending, message];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// This function handles GET requests to the script URL
function doGet(e) {
  return HtmlService.createHtmlOutput(
    "This script is for handling form submissions. Please do not access it directly."
  );
}

// NOTE: Remember to replace 'REPLACE_WITH_YOUR_SPREADSHEET_ID' with the actual ID of your Google Sheet.
// You can find the ID in the URL of your spreadsheet. It's the long string of characters between /d/ and /edit.
// e.g., https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_IS_HERE/edit
