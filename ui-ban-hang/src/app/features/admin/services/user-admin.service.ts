import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { StaffDTO, CustomerDTO, CreateUserRequest, UpdateUserRequest } from '../models/staff.dto';
export type { StaffDTO, CustomerDTO, CreateUserRequest, UpdateUserRequest };

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/admin/user`;
  }

  getStaff(): Observable<StaffDTO[]> {
    return this.http.get<StaffDTO[]>(`${this.baseUrl}/employees`);
  }

  getCustomers(): Observable<CustomerDTO[]> {
    return this.http.get<CustomerDTO[]>(`${this.baseUrl}/customers`);
  }

  createUser(request: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/create`, request);
  }

  updateUser(request: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/update`, request);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${userId}`);
  }
}

