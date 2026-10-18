(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Validators = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE = /^\+?[\d\s().-]{7,20}$/;

  // Each rule: (value, allValues) => error message, or '' when valid.
  const rules = {
    name: (v) => (v.trim() ? '' : 'Full name is required.'),
    email: (v) =>
      !v.trim() ? 'Email is required.' : EMAIL.test(v.trim()) ? '' : 'Enter a valid email address.',
    currentPassword: (v, all) =>
      all.newPassword && !v ? 'Enter your current password to set a new one.' : '',
    newPassword: (v) => (v && v.length < 8 ? 'Password must be at least 8 characters.' : ''),
    confirmPassword: (v, all) => (v !== all.newPassword ? 'Passwords do not match.' : ''),
    phone: (v, all) => {
      const value = v.trim();
      if (!value) return all.textAlerts ? 'Phone number is required for text alerts.' : '';
      return PHONE.test(value) ? '' : 'Enter a valid phone number.';
    },
  };
  return { rules };
});
