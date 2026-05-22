import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../../core/services/config.service';
import { UserProfileResponse, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  /**
   * Get user profile information by ID
   * @param userId The user ID
   */
  getUserProfile(userId: string): Observable<UserProfileResponse> {
    return this.http.get<any>(this.config.getEndpoint(`user/${userId}`)).pipe(
      map((response) => response?.data || response?.user || response)
    );
  }

  /**
   * Update user profile information
   * @param userId The user ID
   * @param profile The updated profile data
   */
  updateProfile(userId: string, profile: UpdateProfileRequest): Observable<UserProfileResponse> {
    return this.http.put<any>(this.config.getEndpoint(`user/${userId}/profile`), profile).pipe(
      map((response) => response?.data || response?.user || response)
    );
  }

  uploadAvatar(userId: string, file: File): Observable<UserProfileResponse> {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);

    return this.http.post<any>(this.config.getEndpoint(`user/${userId}/avatar`), formData).pipe(
      map((response) => response?.data || response?.user || response)
    );
  }

  changePassword(userId: string, request: ChangePasswordRequest): Observable<any> {
    return this.http.put(
      this.config.getEndpoint(`user/${userId}/change-password`),
      request
    );
  }
}
