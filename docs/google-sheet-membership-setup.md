# Google Sheet database setup for the membership form

This project sends membership submissions to Google Sheets when `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` is configured. Google Sheets is used only for membership records; website livestream settings are stored separately in PostgreSQL.

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

## YouTube livestream status

The livestream status badge uses the YouTube Data API. Set `YOUTUBE_API_KEY` as a server-side Secret in Vercel (and in `.env.local` for local development). Restrict the key to YouTube Data API v3; do not add it to client-side variables or commit its value.

## Website data

PostgreSQL stores the website's livestream settings. See [the PostgreSQL setup guide](./postgresql-setup.md) for local and deployment configuration. The `/admin` page still requires `LIVESTREAM_ADMIN_PASSWORD`; livestream writes no longer use a Google Sheets token.

When updating the Apps Script, use the latest `google-apps-script-membership.gs` and redeploy the web app with **Deploy > Manage deployments > Edit > New version > Deploy**. That script handles membership records only.

## Notes

- Membership submissions require a working Apps Script URL.
- The Apps Script creates the `Membership Registrations` sheet and stores membership rows there.
