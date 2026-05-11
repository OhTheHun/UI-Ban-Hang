import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { SupplierListResponse } from '../models/supplier.dto';

@Injectable({
  providedIn: 'root'
})
export class SupplierAdminService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  getSuppliers(): Observable<SupplierListResponse> {
    return this.http.get<SupplierListResponse>(this.config.getEndpoint('supplier/admin/list'));
  }
}
