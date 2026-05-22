import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InvoiceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls the VNPAY callback endpoint with the original return query', () => {
    service.syncVnpayCallback('?vnp_ResponseCode=00&vnp_TxnRef=invoice-123').subscribe();

    const req = httpMock.expectOne(
      'https://localhost:7161/api/payment/vnpay/callback?vnp_ResponseCode=00&vnp_TxnRef=invoice-123'
    );

    expect(req.request.method).toBe('GET');
    req.flush({ RspCode: '00', Message: 'Confirm Success' });
  });
});
