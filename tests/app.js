(function () {
  'use strict';
  const form = document.getElementById('settings-form');
  const status = document.getElementById('form-status');
  const rules = window.Validators.rules;
  const $ = (id) => document.getElementById(id);

  function getValues() {
    const out = {};
    for (const el of form.elements) {
      if (el.name) out[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    }
    return out;
  }

  function validate(el) {
    const rule = rules[el.name];
    if (!rule) return true;
    const message = rule(el.value, getValues());
    $(el.id + '-error').textContent = message;
    if (message) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    return !message;
  }

  // Validate on blur (focusout bubbles, so one listener covers every field).
  form.addEventListener('focusout', (e) => {
    if (e.target.matches('[data-validate]')) validate(e.target);
  });

  // Once a field is flagged, re-check as the user types so the error clears instantly.
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.getAttribute('aria-invalid') === 'true') validate(el);
    if (el.name === 'newPassword' && $('confirmPassword').value) validate($('confirmPassword'));
  });

  // "Text alerts" makes the phone number required.
  $('textAlerts').addEventListener('change', (e) => {
    const phone = $('phone');
    phone.required = e.target.checked;
    $('phone-req').hidden = !e.target.checked;
    if (!e.target.checked || phone.getAttribute('aria-invalid') === 'true') validate(phone);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll('[data-validate]')].filter((el) => !validate(el));
    status.textContent = '';
    if (invalid.length) {
      status.className = 'status status--error';
      status.textContent = `Please fix ${invalid.length} error${invalid.length > 1 ? 's' : ''} and try again.`;
      invalid[0].focus();
      return;
    }
    status.className = 'status status--ok';
    status.textContent = 'Settings saved.';
  });
})();
