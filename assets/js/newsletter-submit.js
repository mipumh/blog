/**
 * Intercepta el submit de los formularios de newsletter y hace POST al
 * Apps Script Web App con Content-Type: text/plain (evita preflight CORS).
 * Muestra feedback inline en el propio formulario.
 *
 * ~1 KB sin minificar. Cargar con `defer`.
 */
(function () {
  'use strict';

  var FORMS = document.querySelectorAll(
    '.newsletter-big__form, .newsletter-inline__form, .newsletter-compact__form, .newsletter-banner__form'
  );
  if (!FORMS.length) return;

  FORMS.forEach(function (form) {
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();
      var url = form.getAttribute('action');
      if (!url) return;

      var emailInput = form.querySelector('input[type="email"]');
      var honeypot = form.querySelector('input[name="website"]');
      var button = form.querySelector('button[type="submit"]');
      if (!emailInput) return;

      var email = emailInput.value.trim();
      if (!email) return;

      setFeedback(form, 'Enviando…', '');
      if (button) button.disabled = true;

      var payload = JSON.stringify({
        email: email,
        website: honeypot ? honeypot.value : ''
      });

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: payload
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (data) {
          if (data && data.ok) {
            form.reset();
            setFeedback(form, '¡Gracias! Revisa tu correo.', 'ok');
          } else {
            setFeedback(form, 'No se pudo suscribir. Revisa el email.', 'err');
          }
        })
        .catch(function () {
          setFeedback(form, 'Error de red. Inténtalo de nuevo.', 'err');
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  });

  function setFeedback(form, msg, state) {
    var el = form.querySelector('.newsletter-feedback');
    if (!el) {
      el = document.createElement('p');
      el.className = 'newsletter-feedback';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      form.appendChild(el);
    }
    el.textContent = msg;
    el.dataset.state = state || '';
  }
})();
