// utils/validators.js

// Basic validation functions
export const isRequired = (v) => v && v.trim() !== "";

export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPasswordStrong = (pwd) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongRegex.test(pwd);
};

export const isNumber = (v) => !isNaN(v) && !isNaN(parseFloat(v));

export const isPhoneValid = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const isAgeValid = (age) => {
  const numAge = parseInt(age);
  return numAge >= 18 && numAge <= 100;
};

export const isNameValid = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

export const isAddressValid = (address) => {
  return address && address.trim().length >= 10;
};

export const isIncomeValid = (income) => {
  const numIncome = parseFloat(income);
  return numIncome >= 0 && numIncome <= 10000000;
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message;
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  name: [
    { validator: isRequired, message: "Name is required" },
    { validator: isNameValid, message: "Name must be 2-50 characters, letters only" }
  ],
  email: [
    { validator: isRequired, message: "Email is required" },
    { validator: isEmailValid, message: "Please enter a valid email address" }
  ],
  password: [
    { validator: isRequired, message: "Password is required" },
    { validator: isPasswordStrong, message: "Password must be 8+ chars with uppercase, lowercase, and number" }
  ],
  phone: [
    { validator: isRequired, message: "Phone number is required" },
    { validator: isPhoneValid, message: "Please enter a valid phone number" }
  ],
  age: [
    { validator: isRequired, message: "Age is required" },
    { validator: isAgeValid, message: "Age must be between 18 and 100" }
  ],
  address: [
    { validator: isRequired, message: "Address is required" },
    { validator: isAddressValid, message: "Address must be at least 10 characters" }
  ],
  income: [
    { validator: isRequired, message: "Income is required" },
    { validator: isIncomeValid, message: "Please enter a valid income amount" }
  ]
};

