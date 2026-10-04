const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";

function getMembershipSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  return SpreadsheetApp.getActiveSpreadsheet();
}

function getMembershipSheet() {
  const spreadsheet = getMembershipSpreadsheet();

  if (!spreadsheet) {
    throw new Error("No Google Sheet is connected to this Apps Script project. Set SPREADSHEET_ID to the real spreadsheet ID.");
  }

  const sheet = spreadsheet.getSheetByName("Membership Registrations") || spreadsheet.insertSheet("Membership Registrations");
  const headers = getMembershipHeaders();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
    const submittedAtIndex = currentHeaders.indexOf("Submitted At");
    if (submittedAtIndex < 0) {
      throw new Error("The Membership Registrations sheet is missing its Submitted At header.");
    }

    if (!currentHeaders.includes("Status")) {
      sheet.insertColumnAfter(submittedAtIndex + 1);
      sheet.getRange(1, submittedAtIndex + 2).setValue("Status");
    }
  }

  return sheet;
}

function getMembershipHeaders() {
  return [
    "Submitted At",
    "Status",
    "Category",
    "Year Joined",
    "Title",
    "Surname",
    "First Name",
    "Other Names",
    "Gender",
    "Birth Month",
    "Birth Day",
    "Marital Status",
    "Residential Address",
    "Nearest Bus Stop",
    "Email Address",
    "Telephone / WhatsApp",
    "Nationality",
    "Highest Qualification",
    "Profession / Occupation",
    "Volunteer Skills",
    "Programmes of Interest",
    "Family & Relationship Groups",
    "Health, Wellness & Lifestyle Groups",
    "Community, Service & Social Impact Groups",
    "Career & Business Life Groups",
    "Consent"
  ];
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseSubmittedAt(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getTime();
}

function doGet(e) {
  try {
    const sheet = getMembershipSheet();
    const values = sheet.getDataRange().getValues();

    if (!values.length) {
      return jsonResponse({ success: true, entries: [], total: 0 });
    }

    const headers = values[0];
    const rows = values.slice(1).map((row) => {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = row[index] ?? "";
      });
      return entry;
    });

    const statusFilter = (e && e.parameter && e.parameter.status ? String(e.parameter.status).trim() : "").toLowerCase();
    const fromFilter = e && e.parameter && e.parameter.from ? String(e.parameter.from).trim() : "";
    const toFilter = e && e.parameter && e.parameter.to ? String(e.parameter.to).trim() : "";

    const filtered = rows.filter((entry) => {
      const hasData = Object.values(entry).some((value) => value !== "" && value !== null && value !== undefined);
      if (!hasData) return false;

      const status = String(entry.Status || "New").trim();
      const matchesStatus = !statusFilter || statusFilter === "all" || status.toLowerCase() === statusFilter;

      const submittedAt = parseSubmittedAt(entry["Submitted At"]);
      const fromTimestamp = fromFilter ? new Date(fromFilter).getTime() : null;
      const toTimestamp = toFilter ? new Date(new Date(toFilter).setHours(23, 59, 59, 999)).getTime() : null;

      const matchesFrom = !fromTimestamp || !submittedAt || submittedAt >= fromTimestamp;
      const matchesTo = !toTimestamp || !submittedAt || submittedAt <= toTimestamp;

      return matchesStatus && matchesFrom && matchesTo;
    });

    return jsonResponse({ success: true, entries: filtered, total: filtered.length });
  } catch (error) {
    return jsonResponse({ success: false, error: error && error.message ? error.message : String(error) });
  }
}

function doPost(e) {
  try {
    const sheet = getMembershipSheet();

    const params = e && e.parameter ? e.parameter : {};
    const entry = {
      "Submitted At": new Date(),
      Status: "New",
      Category: params.category || "",
      "Year Joined": params.yearJoined || "",
      Title: params.title || "",
      Surname: params.surname || "",
      "First Name": params.firstName || "",
      "Other Names": params.otherNames || "",
      Gender: params.gender || "",
      "Birth Month": params.birthMonth || "",
      "Birth Day": params.birthDay || "",
      "Marital Status": params.maritalStatus || "",
      "Residential Address": params.address || "",
      "Nearest Bus Stop": params.nearestBustop || "",
      "Email Address": params.email || "",
      "Telephone / WhatsApp": params.phone || "",
      Nationality: params.nationality || "",
      "Highest Qualification": params.qualification || "",
      "Profession / Occupation": params.occupation || "",
      "Volunteer Skills": params.volunteerSkills || "",
      "Programmes of Interest": stringifyMultiValue(params.programmes),
      "Family & Relationship Groups": stringifyMultiValue(params.familyGroups),
      "Health, Wellness & Lifestyle Groups": stringifyMultiValue(params.wellnessGroups),
      "Community, Service & Social Impact Groups": stringifyMultiValue(params.communityGroups),
      "Career & Business Life Groups": stringifyMultiValue(params.careerGroups),
      Consent: params.consent ? "Yes" : "No"
    };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    sheet.appendRow(headers.map((header) => entry[header] ?? ""));

    return jsonResponse({ success: true, message: "Membership form submitted successfully." });
  } catch (error) {
    return jsonResponse({ success: false, error: error && error.message ? error.message : String(error) });
  }
}

function stringifyMultiValue(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
