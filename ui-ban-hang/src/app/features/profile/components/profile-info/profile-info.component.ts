import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileResponse } from '../../models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent {
  @Input() set profile(value: UserProfileResponse | null) {
    if (value) {
      this.editForm = { ...value };
    }
  }
  
  @Input() isLoading = false;
  @Output() onSave = new EventEmitter<UserProfileResponse>();

  isEditing = signal(false);
  editForm: UserProfileResponse = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  };

  toggleEdit() {
    if (this.isEditing()) {
      this.onSave.emit(this.editForm);
      this.isEditing.set(false);
    } else {
      this.isEditing.set(true);
    }
  }
}
