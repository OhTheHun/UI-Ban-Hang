import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // You can change this URL in one place
  private readonly baseUrl = 'https://localhost:7161/api';

  get apiUrl(): string {
    return this.baseUrl;
  }

  getEndpoint(path: string): string {
    return `${this.baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
  }
}
