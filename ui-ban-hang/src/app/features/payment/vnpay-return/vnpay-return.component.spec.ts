import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { VnpayReturnComponent } from './vnpay-return.component';
import { InvoiceService } from '../../../core/services/invoice.service';

describe('VnpayReturnComponent', () => {
  let fixture: ComponentFixture<VnpayReturnComponent>;
  let invoiceService: {
    syncVnpayCallback: ReturnType<typeof vi.fn>;
  };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    window.history.pushState(
      {},
      '',
      '/payment/vnpay-return?vnp_ResponseCode=00&vnp_TxnRef=invoice-123'
    );

    invoiceService = {
      syncVnpayCallback: vi.fn(() => of({ RspCode: '00', Message: 'Confirm Success' }))
    };
    router = { navigateByUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [VnpayReturnComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                vnp_ResponseCode: '00',
                vnp_TxnRef: 'invoice-123'
              })
            }
          }
        },
        { provide: InvoiceService, useValue: invoiceService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VnpayReturnComponent);
  });

  it('syncs the VNPAY callback and redirects home on success', () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    expect(invoiceService.syncVnpayCallback).toHaveBeenCalledWith(
      '?vnp_ResponseCode=00&vnp_TxnRef=invoice-123'
    );

    vi.advanceTimersByTime(2000);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    vi.useRealTimers();
  });

  it('shows the callback payment status returned by the backend', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance.backendCode()).toBe('00');
    expect(fixture.componentInstance.backendMessage()).toBe('Confirm Success');
  });
});
