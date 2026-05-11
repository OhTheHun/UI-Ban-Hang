import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';

export interface CategoryLookup {
  id: string;
  tenDanhMuc: string;
  description: string;
  parentId: string;
}

export interface DonViTinhLookup {
  id: string;
  tenDonViTinh: string;
}

export interface SupplierLookup {
  id: string;
  supplierName: string;
  phoneNumber: string;
  email: string;
  taxCode: string;
  address: string;
  contactName: string;
  field: string;
  status: string;
}


@Injectable({
  providedIn: 'root'
})
export class LookupService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  getCategories(): Observable<CategoryLookup[]> {
    return this.http.get<any>(this.config.getEndpoint('category')).pipe(
      map((res: any) => res?.data || res || [])
    );
  }

  getDonViTinhs(): Observable<DonViTinhLookup[]> {
    return this.http.get<any>(this.config.getEndpoint('donvitinh')).pipe(
      map((res: any) => res?.data || res || [])
    );
  }

  getSuppliers(): Observable<SupplierLookup[]> {
    return this.http.get<any>(this.config.getEndpoint('supplier')).pipe(
      map((res: any) => res?.data || res || [])
    );
  }
}
