/**
 * Template.gs
 *
 * Descubre el borrador HTML más reciente publicado por la GitHub Action
 * weekly-newsletter.yml en _drafts/newsletters/ y devuelve su URL raw
 * junto con el subject extraído del <title> del HTML.
 *
 * Usa la API pública de GitHub (60 req/h sin auth, suficiente para un envío
 * manual semanal). Fija GITHUB_REF a un SHA o rama estable para evitar caché
 * inconsistente de raw.githubusercontent.com.
 *
 * Copia versionada del proyecto Apps Script.
 */

var GITHUB_OWNER = 'mcarvajal';
var GITHUB_REPO = 'blog';
var GITHUB_BRANCH = 'redesign';
var DRAFTS_PATH = '_drafts/newsletters';

function fetchLatestDraft_() {
  var apiUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
    '/contents/' + DRAFTS_PATH + '?ref=' + GITHUB_BRANCH;

  var resp = UrlFetchApp.fetch(apiUrl, {
    muteHttpExceptions: true,
    headers: { 'Accept': 'application/vnd.github+json' }
  });
  if (resp.getResponseCode() !== 200) {
    throw new Error('GitHub API ' + resp.getResponseCode() + ': ' + resp.getContentText().slice(0, 200));
  }

  var files = JSON.parse(resp.getContentText())
    .filter(function (f) { return f.type === 'file' && /\.html$/.test(f.name); })
    .sort(function (a, b) { return a.name < b.name ? 1 : -1; });

  if (files.length === 0) {
    throw new Error('No hay borradores HTML en ' + DRAFTS_PATH);
  }

  var latest = files[0];
  var rawUrl = latest.download_url;
  var html = UrlFetchApp.fetch(rawUrl).getContentText();

  var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  var subject = titleMatch ? titleMatch[1].trim() : latest.name.replace(/\.html$/, '');

  return { sourceUrl: rawUrl, subject: subject, filename: latest.name };
}
