/**
 * Code.gs
 *
 * Motor de envío del newsletter MIP desde Google Apps Script bound a la Sheet.
 * Crea un menú custom "📧 Newsletter" en la hoja al abrir, y ejecuta el envío
 * de una tanda diaria respetando la cuota de Gmail/Workspace.
 *
 * Lee el HTML del borrador más reciente desde GitHub Raw (ver Template.gs) y
 * envía a los suscriptores activos en bloques de DAILY_QUOTA, personalizando
 * el token de unsubscribe por destinatario.
 *
 * Copia versionada del proyecto Apps Script. Fuente de verdad: Apps Script.
 */

var SHEET_SUBSCRIBERS = 'subscribers';
var SHEET_CONFIG = 'config';
var SHEET_LOG = 'log';
var TZ = 'Europe/Madrid';
var DEFAULT_QUOTA = 1500;
var REMAINING_SAFETY = 100;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📧 Newsletter')
    .addItem('Cargar último borrador', 'menuLoadDraft')
    .addSeparator()
    .addItem('Enviar tanda de hoy', 'menuSendBatch')
    .addItem('Enviar email de prueba (a mí)', 'menuSendTest')
    .addSeparator()
    .addItem('Ver progreso', 'menuShowProgress')
    .addItem('Reiniciar cursor', 'menuResetCursor')
    .addToUi();
}

function menuLoadDraft() {
  try {
    var draft = fetchLatestDraft_();
    setConfig_('draft_subject', draft.subject);
    setConfig_('draft_html_url', draft.sourceUrl);
    setConfig_('draft_loaded_at', nowString_());
    toast_('Borrador cargado: ' + draft.subject);
  } catch (err) {
    toast_('Error: ' + err.message);
  }
}

function menuSendBatch() {
  var ui = SpreadsheetApp.getUi();
  var today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  var lastSend = getConfig_('last_send_date');
  if (lastSend === today) {
    ui.alert('Ya se envió hoy. Vuelve mañana o usa "Reiniciar cursor" si quieres forzar.');
    return;
  }

  var subject = getConfig_('draft_subject');
  var htmlUrl = getConfig_('draft_html_url');
  if (!subject || !htmlUrl) {
    ui.alert('No hay borrador cargado. Usa "Cargar último borrador" primero.');
    return;
  }

  var html;
  try {
    html = UrlFetchApp.fetch(htmlUrl, { muteHttpExceptions: false }).getContentText();
  } catch (err) {
    ui.alert('No pude descargar el HTML del borrador:\n' + err.message);
    return;
  }

  var quota = parseInt(getConfig_('daily_quota'), 10) || DEFAULT_QUOTA;
  var cursor = parseInt(getConfig_('batch_cursor'), 10) || 2;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SUBSCRIBERS);
  var lastRow = sheet.getLastRow();
  if (cursor > lastRow) {
    ui.alert('Cursor al final de la lista. Usa "Reiniciar cursor" para el próximo ciclo.');
    return;
  }

  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = {
    email: header.indexOf('email') + 1,
    status: header.indexOf('status') + 1,
    token: header.indexOf('unsubscribe_token') + 1,
    lastSent: header.indexOf('last_sent') + 1
  };
  if (col.email < 1 || col.status < 1 || col.token < 1) {
    ui.alert('Cabeceras de la hoja subscribers incompletas.');
    return;
  }

  var sent = 0;
  var errors = 0;
  var skipped = 0;
  var rowsToRead = Math.min(quota * 2, lastRow - cursor + 1);
  var rows = sheet.getRange(cursor, 1, rowsToRead, sheet.getLastColumn()).getValues();

  for (var i = 0; i < rows.length; i++) {
    if (sent >= quota) break;
    if (MailApp.getRemainingDailyQuota() <= REMAINING_SAFETY) {
      logRow_('quota_stop', '', 'remaining=' + MailApp.getRemainingDailyQuota());
      break;
    }

    var row = rows[i];
    var absRow = cursor + i;
    var email = (row[col.email - 1] || '').toString().trim();
    var status = (row[col.status - 1] || '').toString();
    var token = (row[col.token - 1] || '').toString();

    if (!email || status !== 'active') {
      skipped++;
      continue;
    }
    if (!token) {
      token = Utilities.getUuid();
      sheet.getRange(absRow, col.token).setValue(token);
    }

    var personalized = html
      .split('{{unsubscribe_base}}').join(webAppUrl_())
      .split('{{token}}').join(encodeURIComponent(token));

    try {
      GmailApp.sendEmail(email, subject, htmlToText_(personalized), {
        htmlBody: personalized,
        name: 'MIP — Máster en Innovación en Periodismo',
        from: 'mip@umh.es'
      });
      sheet.getRange(absRow, col.lastSent).setValue(nowString_());
      sent++;
    } catch (err) {
      errors++;
      logRow_('send_error', email, err.message);
    }
    Utilities.sleep(100);
  }

  var newCursor = cursor + rows.length;
  setConfig_('batch_cursor', newCursor);
  if (sent > 0) {
    setConfig_('last_send_date', today);
  }
  logRow_('batch', '', 'sent=' + sent + ' errors=' + errors + ' skipped=' + skipped + ' cursor=' + newCursor);

  ui.alert(
    'Tanda enviada',
    'Enviados: ' + sent + '\nErrores: ' + errors + '\nSaltados: ' + skipped +
    '\nCursor: ' + newCursor + ' / ' + lastRow +
    '\nCuota Gmail restante hoy: ' + MailApp.getRemainingDailyQuota(),
    ui.ButtonSet.OK
  );
}

function menuSendTest() {
  var subject = getConfig_('draft_subject');
  var htmlUrl = getConfig_('draft_html_url');
  if (!subject || !htmlUrl) {
    SpreadsheetApp.getUi().alert('Carga primero un borrador.');
    return;
  }
  var html = UrlFetchApp.fetch(htmlUrl).getContentText();
  var token = 'TEST-' + Utilities.getUuid();
  var personalized = html
    .split('{{unsubscribe_base}}').join(webAppUrl_())
    .split('{{token}}').join(encodeURIComponent(token));
  var me = Session.getEffectiveUser().getEmail();
  GmailApp.sendEmail(me, '[PRUEBA] ' + subject, htmlToText_(personalized), {
    htmlBody: personalized,
    name: 'MIP — Prueba',
    from: 'mip@umh.es'
  });
  toast_('Email de prueba enviado a ' + me);
}

function menuShowProgress() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SUBSCRIBERS);
  var last = sheet.getLastRow();
  var cursor = parseInt(getConfig_('batch_cursor'), 10) || 2;
  var subject = getConfig_('draft_subject') || '(sin borrador)';
  var lastSend = getConfig_('last_send_date') || '(nunca)';
  var remaining = MailApp.getRemainingDailyQuota();
  SpreadsheetApp.getUi().alert(
    'Progreso newsletter',
    'Borrador actual: ' + subject +
    '\nÚltimo envío: ' + lastSend +
    '\nCursor: ' + cursor + ' / ' + last +
    '\nCuota Gmail restante hoy: ' + remaining,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function menuResetCursor() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('Reiniciar cursor', '¿Seguro? Esto empezará el próximo envío desde la fila 2.', ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;
  setConfig_('batch_cursor', 2);
  setConfig_('last_send_date', '');
  toast_('Cursor reiniciado.');
}

function getConfig_(key) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);
  if (!sheet) return '';
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return '';
}

function setConfig_(key, value) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}

function logRow_(action, email, detail) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LOG);
  if (!sheet) return;
  sheet.appendRow([new Date(), action, email, detail]);
}

function nowString_() {
  return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
}

function toast_(msg) {
  SpreadsheetApp.getActiveSpreadsheet().toast(msg, '📧 Newsletter', 5);
}

function webAppUrl_() {
  try {
    return ScriptApp.getService().getUrl() || '';
  } catch (err) {
    return '';
  }
}

function htmlToText_(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
