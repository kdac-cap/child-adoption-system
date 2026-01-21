// services/localStorageAPI.js

export const getData = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Error reading localStorage", err);
    return null;
  }
};

export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error writing to localStorage", err);
  }
};
