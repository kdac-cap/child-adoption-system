# Updated Adoption Workflow

## New 2-Step Verification Process

### 1. Parent Application Submission
- Parent browses available children
- When parent applies, child status changes to `IN_APPLICATION`
- Child is hidden from browse section for other parents
- Application status: `PENDING_STAFF_APPROVAL`

### 2. Staff Initial Approval
- Staff reviews application in "Application Review" tab
- Staff can approve or reject
- If approved: status changes to `DOCUMENTS_REQUESTED`
- Parent receives notification to submit documents

### 3. Parent Document Submission
- Parent submits required documents
- Application status changes to `DOCUMENTS_SUBMITTED`
- Staff receives notification for document verification

### 4. Staff Document Verification (First Step)
- Staff reviews documents in "Document Verification" tab
- Staff verifies all documents are complete and valid
- If verified: document status changes to `STAFF_VERIFIED`
- Application status changes to `PENDING_ADMIN_APPROVAL`
- Admin receives notification for final approval

### 5. Admin Final Approval (Second Step)
- Admin reviews staff-verified applications
- Admin makes final decision on adoption
- If approved:
  - Application status: `APPROVED`
  - Child status: `ADOPTED`
  - Parent receives success notification
- If rejected:
  - Application status: `REJECTED`
  - Child status: `AVAILABLE` (back to available)
  - Parent receives rejection notification

## Status Flow

### Application Statuses:
- `PENDING_STAFF_APPROVAL` → `DOCUMENTS_REQUESTED` → `DOCUMENTS_SUBMITTED` → `PENDING_ADMIN_APPROVAL` → `APPROVED`/`REJECTED`

### Child Statuses:
- `AVAILABLE` → `IN_APPLICATION` → `ADOPTED` (or back to `AVAILABLE` if rejected)

### Document Statuses:
- `PENDING` → `SUBMITTED` → `STAFF_VERIFIED` → `ADMIN_APPROVED`

## Key Features

1. **Child Visibility Control**: Children in application or adopted are hidden from browse section
2. **Real-time Notifications**: Parents receive notifications at each step
3. **2-Step Verification**: Staff verifies documents first, then admin does final approval
4. **Status Tracking**: Clear status indicators throughout the process
5. **Automatic Status Updates**: Child and application statuses update automatically

## Files Modified

1. `constants.js` - Added status constants
2. `BrowseChildren.jsx` - Hide children in application/adopted
3. `ApplyAdoption.jsx` - Update child status on application
4. `MyApplications.jsx` - Show new status types
5. `Documents.jsx` - Implement 2-step verification
6. `StaffApplications.jsx` - Added document verification tab
7. `AdoptionRequests.jsx` - Admin final approval only
8. `ParentNotifications.jsx` - New notification system
9. `Navbar.jsx` - Added notifications for parents
10. `mockData.js` - Updated with new constants