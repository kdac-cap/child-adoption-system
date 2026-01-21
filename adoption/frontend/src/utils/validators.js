// utils/validators.js
export const isRequired = (v) => v && v.trim() !== "";

export const isEmailValid = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordStrong = (pwd) =>
  pwd.length >= 6;

export const isNumber = (v) => !isNaN(v);

