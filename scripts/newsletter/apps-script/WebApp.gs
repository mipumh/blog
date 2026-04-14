/**
 * WebApp.gs
 *
 * Endpoints públicos del Apps Script Web App del newsletter MIP:
 *
 *   doPost → captación de suscriptores desde los formularios de Jekyll
 *   doGet  → baja vía link del footer del email (action=unsubscribe&token=XXX)
 *
 * Despliegue: Deploy → New deployment → Type: Web App →
 *   Execute as: Me
 *   Who has access: Anyone
 * La URL resultante es la que va en _data/newsletter.yml → action_url.
 *
 * Esta es una copia versionada del código que vive en el proyecto Apps Script
 * bound a la Google Sheet "MIP Newsletter — Lista maestra". La fuente de verdad
 * es el proyecto Apps Script; este archivo es backup.
 */

var SHEET_SUBSCRIBERS = 'subscribers';
var SHEET_LOG = 'log';

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /exec
 * Body: urlencoded o JSON con { email, website }
 *   - email: obligatorio
 *   - website: honeypot, debe venir vacío
 *
 * Respuesta: { ok: true } | { ok: false, error: '...' }
 *
 * Nota CORS: Apps Script no permite setear Access-Control-Allow-Origin
 * desde doPost. El patrón que funciona es que el cliente envíe el POST
 * con Content-Type: text/plain y el body serializado como JSON. Así el
 * navegador no dispara preflight y la respuesta va directa.
 */
function doPost(e) {
  try {
    var data = parsePostBody_(e);
    var email = (data.email || '').toString().trim().toLowerCase();
    var honeypot = (data.website || '').toString();

    if (honeypot.length > 0) {
      return jsonResponse_({ ok: true });
    }

    if (!email || !EMAIL_RE.test(email)) {
      return jsonResponse_({ ok: false, error: 'invalid_email' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_SUBSCRIBERS);
    if (!sheet) {
      return jsonResponse_({ ok: false, error: 'config_error' });
    }

    if (emailExists_(sheet, email)) {
      logEvent_('subscribe_dup', email, '');
      return jsonResponse_({ ok: true, existing: true });
    }

    var now = Utilities.formatDate(new Date(), 'Europe/Madrid', 'yyyy-MM-dd HH:mm:ss');
    var token = Utilities.getUuid();
    sheet.appendRow([email, now, 'web', 'active', token, '']);
    logEvent_('subscribe', email, 'web');

    return jsonResponse_({ ok: true });
  } catch (err) {
    logEvent_('error', '', String(err));
    return jsonResponse_({ ok: false, error: 'server_error' });
  }
}

/**
 * GET /exec?action=unsubscribe&token=XXX
 * Devuelve una página HTML simple.
 */
function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.action === 'unsubscribe' && params.token) {
    var ok = unsubscribeByToken_(params.token);
    return htmlResponse_(
      ok
        ? '<h1>Te has dado de baja</h1><p>No recibirás más correos de MIP Newsletter.</p>'
        : '<h1>Enlace no válido</h1><p>Si crees que es un error, contacta con el equipo MIP.</p>'
    );
  }
  return htmlResponse_('<h1>MIP Newsletter</h1><p>Endpoint activo.</p>');
}

function unsubscribeByToken_(token) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_SUBSCRIBERS);
  if (!sheet) return false;

  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var emailCol = header.indexOf('email');
  var statusCol = header.indexOf('status');
  var tokenCol = header.indexOf('unsubscribe_token');
  if (tokenCol === -1 || statusCol === -1) return false;

  for (var i = 1; i < data.length; i++) {
    if (data[i][tokenCol] === token) {
      if (data[i][statusCol] !== 'unsubscribed') {
        sheet.getRange(i + 1, statusCol + 1).setValue('unsubscribed');
        logEvent_('unsubscribe', data[i][emailCol] || '', token);
      }
      return true;
    }
  }
  return false;
}

function emailExists_(sheet, email) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var values = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if ((values[i][0] || '').toString().toLowerCase() === email) return true;
  }
  return false;
}

function parsePostBody_(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    var type = e.postData.type || '';
    if (type.indexOf('application/json') !== -1 || type.indexOf('text/plain') !== -1) {
      try { return JSON.parse(raw); } catch (err) { /* cae al parser urlencoded */ }
    }
    var out = {};
    raw.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if (kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    });
    return out;
  }
  return e.parameter || {};
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function htmlResponse_(body) {
  return HtmlService
    .createHtmlOutput(
      '<!doctype html><html lang="es"><meta charset="utf-8">' +
      '<title>MIP Newsletter</title>' +
      '<style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;color:#0A0A0A}' +
      'h1{color:#00C853}</style>' +
      body +
      '</html>'
    )
    .setTitle('MIP Newsletter');
}

function logEvent_(action, email, detail) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var log = ss.getSheetByName(SHEET_LOG);
    if (!log) return;
    log.appendRow([new Date(), action, email, detail]);
  } catch (err) { /* silencioso */ }
}
