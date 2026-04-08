import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private dropdownOpenSubject = new Subject<string | null>();
  
  dropdownOpen$ = this.dropdownOpenSubject.asObservable();

  openDropdown(dropdownId: string) {
    this.dropdownOpenSubject.next(dropdownId);
  }

  closeAllDropdowns() {
    this.dropdownOpenSubject.next(null);
  }
}
