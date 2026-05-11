export interface DashboardStats {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  newCustomers: number;
  revenueChangePercent: number;
  profitChangePercent: number;
  ordersChangePercent: number;
  customersChangePercent: number;
}

export interface ChartDataItem {
  label: string;
  revenue: number;
  profit: number;
}

export enum InvoiceStatus {
  Confirmed = 0,
  Processing = 1,
  Delivering = 2,
  Completed = 3,
  Canceled = 4
}

export interface TransactionItem {
  code: string;
  customerName: string;
  date: string;
  totalAmount: number;
  status: keyof typeof InvoiceStatus | InvoiceStatus;
}

export interface DashboardOverviewResponse {
  message: string;
  data: DashboardStats & {
    chartData: ChartDataItem[];
    recentTransactions: TransactionItem[];
  };
}
