import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
   */
  cancelOrder(invoiceId: string): Observable<any> {
    // Assuming cancel uses the invoice ID in the URL or body based on the requirement
    return this.http.put(this.config.getEndpoint(`invoice/cancel/${invoiceId}`), {});
  }
}
