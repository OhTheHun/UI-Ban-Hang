export interface RevenueStats {
  todayRevenue: number;
  newOrdersCount: number;
  conversionRate: number;
}

export type CouponStatus = 'active' | 'expired';

export interface Coupon {
  code: string;
  status: CouponStatus;
  expiryText: string;
  discountText: string;
  discountType: 'percentage' | 'fixed' | 'free_ship';
}
