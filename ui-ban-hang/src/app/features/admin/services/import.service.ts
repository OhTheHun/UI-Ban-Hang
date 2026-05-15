import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Import, ImportFilterParams } from '../models/import.model';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  getImports(filter: ImportFilterParams): Observable<Import[]> {
    let params = new HttpParams();
    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate);
    }
    if (filter.toDate) {
      params = params.set('toDate', filter.toDate);
    }
    if (filter.productName) {
      params = params.set('productName', filter.productName);
    }

    return this.http.get<Import[]>(this.config.getEndpoint('import/list'), { params });
  }

  createImport(importData: Import): Observable<any> {
    return this.http.post(this.config.getEndpoint('import/create'), importData);
  }
}
