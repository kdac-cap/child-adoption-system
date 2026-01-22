// src/services/initData.js
import { getData, saveData } from "./localStorageAPI";

export const initializeData = () => {
  // Initialize children if not present
  if (!getData("children").length) {
    saveData("children", [
      { id: 1, name: "Alice", age: 5, gender: "Female" },
      { id: 2, name: "Bob", age: 6, gender: "Male" },
      { id: 3, name: "Clara", age: 4, gender: "Female" },
    ]);
  }

  // Initialize users if not present
  if (!getData("users").length) {
    saveData("users", [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Mary Jane", email: "mary@example.com" },
    ]);
  }

  // Initialize adoptions if not present
  if (!getData("adoptions").length) {
    saveData("adoptions", [
      { id: 1, userId: 1, childId: 1, status: "Pending" },
      { id: 2, userId: 2, childId: 2, status: "Approved" },
    ]);
  }
};
