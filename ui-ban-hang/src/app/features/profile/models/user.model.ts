/**
 * Represents the detailed user profile information
 * returned by the GET /user/{id} API
 */
export interface UserProfileResponse {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
}

/**
 * Represents the request payload for updating user profile
 */
export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  address: string;
}

/**
 * View model used for the profile dashboard UI
 */
export interface UserProfileView extends UserProfileResponse {
  avatarUrl?: string;
  lastLogin?: string;
}
