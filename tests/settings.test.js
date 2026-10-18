const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { rules } = require('../validators.js');

describe('validator rules (pure logic)', () => {
  test('password under 8 chars is invalid; 8+ and empty are valid', () => {
    assert.match(rules.newPassword('1234567'), /at least 8/);
    assert.equal(rules.newPassword('12345678'), '');
    assert.equal(rules.newPassword(''), '');
  });
  test('phone is required only when text alerts are on', () => {
    assert.match(rules.phone('', { textAlerts: true }), /required/);
    assert.equal(rules.phone('', { textAlerts: false }), '');
    assert.match(rules.phone('abc', { textAlerts: true }), /valid/);
    assert.equal(rules.phone('+92 300 1234567', { textAlerts: true }), '');
  });
  test('confirm password must match', () => {
    assert.match(rules.confirmPassword('x', { newPassword: 'y' }), /match/);
    assert.equal(rules.confirmPassword('y', { newPassword: 'y' }), '');
  });
  test('email format', () => {
    assert.match(rules.email('nope'), /valid/);
    assert.equal(rules.email('a@b.co'), '');
  });
});

describe('form behaviour (real HTML + JS in jsdom)', () => {
  let window, document;
  const $ = (id) => document.getElementById(id);
  const blur = (el) => el.dispatchEvent(new window.FocusEvent('focusout', { bubbles: true }));
  const type = (el, v) => { el.value = v; el.dispatchEvent(new window.Event('input', { bubbles: true })); };
  const submit = () => $('settings-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

  beforeEach(async () => {
    const dom = await JSDOM.fromFile(path.join(__dirname, '..', 'index.html'), {
      runScripts: 'dangerously', resources: 'usable',
    });
    window = dom.window; document = window.document;
    if (document.readyState !== 'complete') await new Promise((r) => window.addEventListener('load', r));
  });

  test('short password: no error before blur, inline error on blur, clears at 8 chars', () => {
    type($('newPassword'), 'abc');
    assert.equal($('newPassword-error').textContent, '');
    blur($('newPassword'));
    assert.match($('newPassword-error').textContent, /at least 8/);
    assert.equal($('newPassword').getAttribute('aria-invalid'), 'true');
    type($('newPassword'), 'abcdefgh');
    assert.equal($('newPassword-error').textContent, '');
    assert.equal($('newPassword').hasAttribute('aria-invalid'), false);
  });

  test('text alerts toggles phone required and its error', () => {
    assert.equal($('phone').required, false);
    $('textAlerts').checked = true;
    $('textAlerts').dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal($('phone').required, true);
    blur($('phone'));
    assert.match($('phone-error').textContent, /required/);
    $('textAlerts').checked = false;
    $('textAlerts').dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal($('phone').required, false);
    assert.equal($('phone-error').textContent, '');
  });

  test('submit with errors focuses first invalid field and reports count', () => {
    submit();
    assert.equal(document.activeElement, $('name'));
    assert.match($('form-status').textContent, /fix 2 errors/);
  });

  test('valid submit shows success', () => {
    type($('name'), 'Zaryan'); type($('email'), 'z@example.com');
    submit();
    assert.equal($('form-status').textContent, 'Settings saved.');
  });

  test('accessibility wiring: labels exist and aria-describedby targets exist', () => {
    for (const el of document.querySelectorAll('input, select')) {
      assert.ok(document.querySelector(`label[for="${el.id}"]`), `label for #${el.id}`);
      for (const id of (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean)) {
        assert.ok($(id), `#${id} referenced by #${el.id}`);
      }
    }
  });
});
