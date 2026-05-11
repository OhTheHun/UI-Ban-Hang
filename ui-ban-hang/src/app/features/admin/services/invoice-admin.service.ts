import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { InvoiceApprovalDTO } from '../models/invoice-approval.dto';

export interface InvoiceApprovalResponse {
  id: string;
  code: string;
  customerName: string;
  createdTime: string;
  totalAmount: number;
  status: string;
}

export interface GenericInvoice {
  invoiceId: string;
  code: string;
  totalAmount: number;
  status: string;
  createdTime: string;
  userEmail: string;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  customerId: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceAdminService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  getInvoicesForApproval(): Observable<InvoiceApprovalResponse[]> {
    return this.http.get<InvoiceApprovalResponse[]>(this.config.getEndpoint('invoice/admin/approval'));
  }

  getProcessedOrders(userId: string): Observable<InvoiceApprovalResponse[]> {
    return this.http.get<InvoiceApprovalResponse[]>(this.config.getEndpoint(`invoice/processed-orders/${userId}`));
  }

  getAllInvoices(): Observable<GenericInvoice[]> {
    return this.http.get<any>(this.config.getEndpoint('invoice/all')).pipe(
      map(res => res?.data || res)
    );
  }

  filterInvoices(status: number): Observable<GenericInvoice[]> {
    const params = new HttpParams().set('Status', status.toString());
    return this.http.get<any>(this.config.getEndpoint('invoice/filter'), { params }).pipe(
      map(res => res?.data || res)
    );
  }

  getInvoiceDetail(invoiceId: string): Observable<InvoiceApprovalDTO> {
    return this.http.get<InvoiceApprovalDTO>(this.config.getEndpoint(`invoice/${invoiceId}`));
  }

  updateProcessing(invoiceId: string, userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put(this.config.getEndpoint(`invoice/update-processing/${invoiceId}`), {}, { params });
  }

  updateDelivering(invoiceId: string, userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put(this.config.getEndpoint(`invoice/update-delivering/${invoiceId}`), {}, { params });
  }

  updateCompleted(invoiceId: string, userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put(this.config.getEndpoint(`invoice/confirm-payment/${invoiceId}`), {}, { params });
  }

  cancelInvoice(invoiceId: string, userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put(this.config.getEndpoint(`invoice/cancel/${invoiceId}`), {}, { params });
  }
}

