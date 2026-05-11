import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface CreateInvoiceRequest {
  customerId: string | null;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
}

export interface InvoiceItemRequest {
  invoiceId: string;
  productId: string;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  createInvoice(request: CreateInvoiceRequest): Observable<any> {
    return this.http.post(this.config.getEndpoint('invoice/create'), request);
  }

  addInvoiceItems(items: InvoiceItemRequest[]): Observable<any> {
    return this.http.post(this.config.getEndpoint('invoice/add-list'), items);
  }
}
