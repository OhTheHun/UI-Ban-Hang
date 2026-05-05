import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { UserProfileResponse, UpdateProfileRequest } from '../models/user.model';

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
    return this.http.get<UserProfileResponse>(this.config.getEndpoint(`user/${userId}`));
  }

  /**
   * Update user profile information
   * @param userId The user ID
   * @param profile The updated profile data
   */
  updateProfile(userId: string, profile: UpdateProfileRequest): Observable<any> {
    return this.http.put(this.config.getEndpoint(`user/${userId}`), profile);
  }
}
