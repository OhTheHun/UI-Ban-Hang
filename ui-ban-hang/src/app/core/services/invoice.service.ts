import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export interface CreateVnpayPaymentRequest {
  invoiceId: string;
  ipAddress: string;
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

  createVnpayPayment(request: CreateVnpayPaymentRequest): Observable<any> {
    return this.http.post(
      this.config.getEndpoint('payment/vnpay/create'),
      request,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json-patch+json'
        })
      }
    );
  }

  syncVnpayCallback(queryString: string): Observable<any> {
    const normalizedQuery = queryString
      ? queryString.startsWith('?')
        ? queryString
        : `?${queryString}`
      : '';

    return this.http.get(this.config.getEndpoint(`payment/vnpay/callback${normalizedQuery}`));
  }
}
