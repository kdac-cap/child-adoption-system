/**
 * Admin Utilities - Helper functions for admin operations
 */

export const calculateStats = (adoptions = [], children = [], users = [], documents = []) => {
  const pending = adoptions.filter((a) => a.status === "Pending").length;
  const approved = adoptions.filter((a) => a.status === "Approved").length;
  const rejected = adoptions.filter((a) => a.status === "Rejected").length;

  return {
    totalUsers: users.length,
    totalChildren: children.length,
    totalAdoptions: adoptions.length,
    pendingRequests: pending,
    approvedRequests: approved,
    rejectedRequests: rejected,
    totalDocuments: documents.length,
  };
};

export const getStatusBadgeClass = (status) => {
  const s = status?.trim().toLowerCase();
  if (s === "approved") return "bg-success";
  if (s === "pending") return "bg-warning text-dark";
  if (s === "rejected") return "bg-danger";
  return "bg-secondary";
};

export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  try {
    return new Date(dateString).toLocaleString("en-IN");
  } catch {
    return dateString;
  }
};

export const downloadFile = (fileData, fileName) => {
  try {
    const a = document.createElement("a");
    a.href = fileData;
    a.download = fileName;
    a.click();
    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    return false;
  }
};

export const confirmAction = (actionName) => {
  return window.confirm(`Are you sure you want to ${actionName}?`);
};

export const generateAuditLog = (action, user, details) => {
  return {
    timestamp: new Date().toISOString(),
    action,
    user,
    details,
    status: "Success",
  };
};

export const searchInArray = (array, searchTerm, searchFields = []) => {
  if (!searchTerm.trim()) return array;

  const term = searchTerm.toLowerCase();
  return array.filter((item) =>
    searchFields.some(
      (field) =>
        item[field] && item[field].toString().toLowerCase().includes(term)
    )
  );
};

export const filterByStatus = (array, status) => {
  if (status === "all") return array;
  return array.filter((item) => item.status === status);
};
