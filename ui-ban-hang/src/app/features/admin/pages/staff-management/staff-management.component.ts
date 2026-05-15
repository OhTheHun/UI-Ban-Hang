import { Component, signal, computed, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAdminService } from '../../services/user-admin.service';
import { StaffDTO, CustomerDTO, CreateUserRequest, UpdateUserRequest } from '../../models/staff.dto';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.scss'
})
export class StaffManagementComponent implements OnInit {
  currentTab = signal<'staff' | 'customer'>('staff');
  staffList = signal<StaffDTO[]>([]);
  customerList = signal<CustomerDTO[]>([]);
  isLoading = signal(false);
  isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin');

  // Search and Filters
  searchQuery = signal('');
  
  // Modals
  showAddModal = signal(false);
  isEditMode = signal(false);
  selectedUser = signal<StaffDTO | CustomerDTO | null>(null);
  userForm: FormGroup;

  // Delete Confirm
  showDeleteConfirm = signal(false);
  userToDelete = signal<StaffDTO | CustomerDTO | null>(null);

  // Dropdown Action
  activeDropdownId = signal<string | null>(null);
  dropdownPosition = signal({ top: '0px', left: '0px' });

  constructor(
    private userAdminService: UserAdminService,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      role: ['Seller', Validators.required],
      birthday: ['', Validators.required],
      identify: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  private readonly MANAGED_ROLES = ['Seller', 'WareHouseManager'];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    if (this.currentTab() === 'staff') {
      this.userAdminService.getStaff().subscribe({
        next: (res) => {
          const filteredStaff = res.filter(u => this.MANAGED_ROLES.includes(u.role));
          this.staffList.set(filteredStaff);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.userAdminService.getCustomers().subscribe({
        next: (res) => {
          this.customerList.set(res);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  setTab(tab: 'staff' | 'customer') {
    this.currentTab.set(tab);
    this.loadData();
  }

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const list = this.currentTab() === 'staff' ? this.staffList() : this.customerList();
    
    if (!query) return list;
    
    return list.filter(u => 
      u.fullName.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) ||
      u.phone.includes(query)
    );
  });

  // CRUD Actions
  openAddModal() {
    this.isEditMode.set(false);
    this.userForm.reset({ role: 'Seller', isActive: true, salary: 0 });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('email')?.enable();
    this.showAddModal.set(true);
  }

  openEditModal(user: any) {
    if (!user) return;
    this.isEditMode.set(true);
    this.selectedUser.set(user);
    this.activeDropdownId.set(null);

    this.userForm.patchValue({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      role: user.role || 'Seller',
      birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
      identify: user.identify ?? '',
      salary: user.salary ?? 0,
      isActive: user.isActive
    });

    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('email')?.disable();
    this.showAddModal.set(true);
  }

  closeModal() {
    this.showAddModal.set(false);
    this.selectedUser.set(null);
  }

  submitForm() {
    if (this.userForm.invalid && !this.isEditMode()) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.getRawValue();
    this.isLoading.set(true);

    if (this.isEditMode()) {
      const request: UpdateUserRequest = {
        id: this.selectedUser()?.id!,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        isActive: formData.isActive,
        birthday: formData.birthday,
        identify: formData.identify,
        salary: Number(formData.salary || 0)
      };

      this.userAdminService.updateUser(request).subscribe({
        next: () => {
          this.toastService.success('Cập nhật người dùng thành công');
          this.loadData();
          this.closeModal();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastService.error('Lỗi khi cập nhật người dùng');
          console.error('Update Error:', err);
          this.isLoading.set(false);
        }
      });
    } else {
      // CreateEmployeeRequestDto không có isActive theo Swagger
      const request: CreateUserRequest = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        birthday: formData.birthday,
        identify: formData.identify,
        salary: Number(formData.salary || 0)
      };

      this.userAdminService.createUser(request).subscribe({
        next: () => {
          this.toastService.success('Thêm người dùng thành công');
          this.loadData();
          this.closeModal();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastService.error('Lỗi khi thêm người dùng');
          console.error('Create Error:', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  deleteUser(user: any) {
    if (!user) return;
    this.userToDelete.set(user);
    this.activeDropdownId.set(null);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const user = this.userToDelete();
    if (user) {
      this.userAdminService.deleteUser(user.id).subscribe({
        next: () => {
          this.toastService.success('Xóa người dùng thành công');
          this.loadData();
          this.showDeleteConfirm.set(false);
        },
        error: (err) => {
          this.toastService.error('Lỗi khi xóa người dùng');
          console.error(err);
        }
      });
    }
  }

  // UI Helpers
  toggleDropdown(event: MouseEvent, userId: string) {
    event.stopPropagation();
    if (this.activeDropdownId() === userId) {
      this.activeDropdownId.set(null);
    } else {
      this.activeDropdownId.set(userId);
      this.updateDropdownPosition(event);
    }
  }

  updateDropdownPosition(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition.set({
      top: `${rect.bottom + 5}px`,
      left: `${rect.left - 120}px`
    });
  }

  @HostListener('document:click', ['$event'])
  hostClick(event: MouseEvent) {
    this.activeDropdownId.set(null);
  }

  getSelectedUserForAction(): any {
    const id = this.activeDropdownId();
    if (!id) return null;
    const list = this.currentTab() === 'staff' ? this.staffList() : this.customerList();
    return list.find(u => u.id === id) ?? null;
  }

  onEditAction() {
    const user = this.getSelectedUserForAction();
    this.openEditModal(user);
  }

  onDeleteAction() {
    const user = this.getSelectedUserForAction();
    this.deleteUser(user);
  }
}
