// Test data for admin approval flow
// Run this in browser console to add test data

// Add test application with PENDING_ADMIN_APPROVAL status
const testApplication = {
  id: 999,
  parentUsername: "testparent",
  parentName: "Test Parent",
  childId: 1,
  childName: "Aarav",
  status: "PENDING_ADMIN_APPROVAL",
  submittedAt: new Date().toISOString(),
  staffMessage: "Application approved by staff"
};

// Add test documents with STAFF_VERIFIED status
const testDocuments = {
  identityProof: "test-id.pdf",
  addressProof: "test-address.pdf",
  ageProof: "test-age.pdf",
  incomeProof: "test-income.pdf",
  marriageProof: "test-marriage.pdf",
  medicalCertificate: "test-medical.pdf",
  policeVerification: "test-police.pdf",
  policeClearance: "test-clearance.pdf",
  photographs: "test-photos.jpg",
  status: "STAFF_VERIFIED",
  submittedAt: new Date().toISOString(),
  staffVerifiedAt: new Date().toISOString(),
  parentUsername: "testparent"
};

// Get existing data
const applications = JSON.parse(localStorage.getItem("applications")) || [];
applications.push(testApplication);
localStorage.setItem("applications", JSON.stringify(applications));

// Add documents
localStorage.setItem("documents_testparent", JSON.stringify(testDocuments));

console.log("Test data added for admin approval flow");
console.log("Application:", testApplication);
console.log("Documents:", testDocuments);