// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  AUTH_ENDPOINTS: {
    REGISTER: '/api/auth/register',
    REGISTER_CHILD_WELFARE: '/api/auth/register/child-welfare',
    LOGIN: '/api/auth/login'
  },
  CHILD_ENDPOINTS: {
    BASE: '/api/children',
    BY_STATUS: '/api/children/status',
    BY_ID: '/api/children'
  },
  TIMEOUT: 10000, // 10 seconds
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// User Roles
export const USER_ROLES = {
  PARENT: 'PARENT',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  AGENCY: 'AGENCY',
  CHILD_WELFARE: 'CHILD_WELFARE'
};

// Child Status
export const CHILD_STATUS = {
  AVAILABLE: 'AVAILABLE',
  PENDING: 'PENDING',
  ADOPTED: 'ADOPTED',
  UNAVAILABLE: 'UNAVAILABLE'
};

// Gender
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

// Route mappings for different user roles
export const ROLE_ROUTES = {
  [USER_ROLES.PARENT]: '/parent',
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.STAFF]: '/staff',
  [USER_ROLES.AGENCY]: '/agency',
  [USER_ROLES.CHILD_WELFARE]: '/child-welfare'
};