import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';
import { OrderSummary, OrderDetail } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  /**
   * Get all invoices for a specific customer
   * @param customerId The customer ID
   */
  getOrdersByUser(customerId: string): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(this.config.getEndpoint(`invoice/customer/${customerId}`));
  }

  /**
   * Get detail of a specific invoice
   * @param invoiceId The invoice ID
   */
  getOrderDetail(invoiceId: string): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(this.config.getEndpoint(`invoice/${invoiceId}`));
  }

  /**
   * Cancel an invoice
   * @param invoiceId The invoice ID
   * @param userId The user who cancels this invoice
   */
  cancelOrder(invoiceId: string, userId: string, reason: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put(this.config.getEndpoint(`invoice/cancel/${invoiceId}`), { reason }, { params });
  }
}
