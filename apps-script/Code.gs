/**
 * Landing Page Leads - form receiver for the ten senior / downsizing pages.
 * Bound to the Google Sheet "Landing Page Leads" (tab "Leads").
 *
 * Every POST from a landing page form:
 *   1. appends a row to the Leads tab
 *   2. emails mk@melissakiehl.com with subject "LEAD: Landing page - <page name>"
 *   3. labels that email LEAD, stars it and marks it important
 *      (Gmail filters can't be created from here, so the script labels the mail itself)
 *
 * Deploy: Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 */
var NOTIFY_TO   = 'mk@melissakiehl.com';
var SHEET_NAME  = 'Leads';
var LABEL_NAME  = 'LEAD';
var HEADERS = ['Timestamp', 'Page', 'Name', 'Street address', 'Town or city', 'State', 'ZIP', 'Situation answer', 'Page URL'];

function clean_(v, max) {
  v = (v == null ? '' : String(v)).replace(/\r\n?/g, '\n').trim();
  if (v.length > max) v = v.slice(0, max);
  // keep the sheet from treating a typed "=..." as a formula
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  // Honeypot: real visitors never fill this hidden field.
  if (p._gotcha) return ok_();

  var page    = clean_(p.page_name || p.page, 120) || 'Unknown page';
  var name    = clean_(p.name, 120);
  var street  = clean_(p.street_address, 200);
  var city    = clean_(p.city, 100);
  var state   = clean_(p.state, 20);
  var zip     = clean_(p.zip, 15);
  var answer  = clean_(p.situation, 4000);
  var pageUrl = clean_(p.page_url, 300);
  if (!name && !street && !answer) return ok_();   // empty post, ignore

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_();
    // Leading apostrophe keeps ZIPs like 06103 as text (otherwise Sheets drops the 0).
    sh.appendRow([new Date(), page, name, street, city, state, zip ? "'" + zip.replace(/^'/, '') : '', answer, pageUrl]);
  } finally {
    lock.releaseLock();
  }

  var subject = 'LEAD: Landing page - ' + page;
  var body =
    'New note from the ' + page + ' landing page.\n\n' +
    'Name: ' + name + '\n' +
    'Mailing address: ' + street + ', ' + city + ', ' + state + ' ' + zip + '\n\n' +
    'Their answer:\n' + answer + '\n\n' +
    (pageUrl ? 'Page: ' + pageUrl + '\n' : '') +
    'Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '\n';

  GmailApp.sendEmail(NOTIFY_TO, subject, body, { name: 'Landing Page Leads' });
  labelLatest_(subject);
  return ok_();
}

function doGet() {
  return ContentService.createTextOutput('Landing Page Leads receiver is running.');
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Show timestamps in Connecticut time (a sheet made through the API starts on GMT).
  if (ss.getSpreadsheetTimeZone() !== 'America/New_York') ss.setSpreadsheetTimeZone('America/New_York');
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

// Find the mail just sent to ourselves, then label LEAD, star and mark important.
function labelLatest_(subject) {
  var label = GmailApp.getUserLabelByName(LABEL_NAME) || GmailApp.createLabel(LABEL_NAME);
  var q = 'subject:"' + subject.replace(/"/g, '') + '" newer_than:1d -label:' + LABEL_NAME;
  for (var i = 0; i < 6; i++) {
    var threads = GmailApp.search(q, 0, 5);
    if (threads.length) {
      threads.forEach(function (t) {
        t.addLabel(label);
        t.markImportant();
        t.getMessages().forEach(function (m) { m.star(); });
      });
      return;
    }
    Utilities.sleep(1500);
  }
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor (Run > testSetup) to grant permissions and check the sheet. */
function testSetup() {
  sheet_();
  GmailApp.getUserLabelByName(LABEL_NAME) || GmailApp.createLabel(LABEL_NAME);
  Logger.log('Ready: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
