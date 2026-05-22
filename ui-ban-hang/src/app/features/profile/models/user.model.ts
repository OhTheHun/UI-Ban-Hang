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
  image?: string;
  avatar?: string;
  avatarUrl?: string;
  imageUrl?: string;
  url?: string;
}

/**
 * Represents the request payload for updating user profile
 */
export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  address: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * View model used for the profile dashboard UI
 */
export interface UserProfileView extends UserProfileResponse {
  avatarUrl?: string;
  lastLogin?: string;
}
