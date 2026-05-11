export interface SupplierDTO {
  id: string;
  supplierName: string;
  mst: string;        // Tax code
  contactName: string;
  contactPhone: string;
  field: string;
  status: string;     // API returns string status
}

export interface SupplierListResponse {
  suppliers: SupplierDTO[];
}
