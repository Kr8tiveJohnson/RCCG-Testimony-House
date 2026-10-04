# Google Sheet database setup for the membership form

This project can now send each membership submission to a Google Sheet when `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` is configured.

## 1) Create the Google Sheet

1. Open Google Sheets.
2. Create a new spreadsheet.
3. Name the first sheet `Membership Registrations`.
4. Keep it blank for now; the Apps Script will create the headers automatically.
5. Copy the spreadsheet ID from the URL. Example:
   - URL: `https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890/edit`
   - Sheet ID: `1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`

## 2) Add the Apps Script

1. Open Google Apps Script: https://script.google.com/
2. Create a new project.
3. Replace the default code with the contents of `google-apps-script-membership.gs` from the project root.
4. Save the project.

## 3) Connect the Apps Script to the Google Sheet

Open the Apps Script project and replace this line in the file:

```javascript
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
```

Paste the real spreadsheet ID from step 1.

## 4) Deploy as a web app

1. In Apps Script, click Deploy > New deployment.
2. Choose Web app.
3. Set the app to execute as: `Me`
4. Set access to: `Anyone`
5. Deploy and copy the generated URL.

When you update the Apps Script code later, the existing `/exec` URL continues to point to its deployed version. Open **Deploy > Manage deployments**, edit the web app deployment, choose **New version**, and deploy it again. Keep the same deployment URL in `.env.local`.

## 5) Add the URL to this project

In the project root, create a `.env.local` file with:

```bash
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Then restart the app with:

```bash
npm run dev
```

## Notes

- The form will keep working in preview mode if the URL is not set.
- This is a simple starter database for membership submissions.
- A larger website-wide database can be added later with a more structured backend and admin dashboard.
