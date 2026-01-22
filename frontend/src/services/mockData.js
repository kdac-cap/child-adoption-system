// src/services/mockData.js

// Initialize children data in localStorage if not exists
if (!localStorage.getItem("childrenData")) {
  const initialChildren = [
    {
      id: 1,
      name: "Aarav",
      age: 3,
      gender: "Male",
      status: "AVAILABLE",
      photo: "https://via.placeholder.com/200x200/4CAF50/white?text=Aarav",
      healthReport: "Excellent health, all vaccinations up to date",
      fosterHistory: "In care for 6 months, well-adjusted child",
      description: "A cheerful and energetic boy who loves playing with toys",
      addedBy: "staff",
      addedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Ananya",
      age: 5,
      gender: "Female",
      status: "AVAILABLE",
      photo: "https://via.placeholder.com/200x200/FF9800/white?text=Ananya",
      healthReport: "Good health, minor allergy to peanuts",
      fosterHistory: "In care for 1 year, loves reading and drawing",
      description: "A bright and creative girl who enjoys storytelling",
      addedBy: "staff",
      addedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Rohan",
      age: 2,
      gender: "Male",
      status: "AVAILABLE",
      photo: "https://via.placeholder.com/200x200/2196F3/white?text=Rohan",
      healthReport: "Healthy development, regular check-ups completed",
      fosterHistory: "In care for 8 months, very social and friendly",
      description: "A happy toddler who loves music and dancing",
      addedBy: "staff",
      addedAt: new Date().toISOString()
    }
  ];
  localStorage.setItem("childrenData", JSON.stringify(initialChildren));
}

export const childrenData = JSON.parse(localStorage.getItem("childrenData")) || [];

export const applicationsData = [
  {
    id: 101,
    parentName: "Rahul Sharma",
    childName: "Aarav",
    childId: 1,
    status: "PENDING_STAFF_APPROVAL",
    submittedAt: "2024-01-15",
    staffMessage: ""
  },
  {
    id: 102,
    parentName: "Sneha Patil",
    childName: "Ananya",
    childId: 2,
    status: "DOCUMENTS_REQUESTED",
    submittedAt: "2024-01-10",
    staffMessage: "Please submit required documents for verification"
  }
];

export const documentsData = [
  {
    id: 1,
    parentUsername: "parent",
    applicationId: 102,
    identityProof: null,
    addressProof: null,
    ageProof: null,
    incomeProof: null,
    marriageProof: null,
    medicalCertificate: null,
    policeVerification: null,
    policeClearance: null,
    photographs: null,
    status: "PENDING",
    submittedAt: null,
    adminComments: ""
  }
];

export const notificationsData = [
  { id: 1, message: "Application approved", read: false, type: "success" },
  { id: 2, message: "Home visit scheduled", read: true, type: "info" },
  { id: 3, message: "Documents required for verification", read: false, type: "warning" }
];
