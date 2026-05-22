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
  searchQuery = signal('');
  isAdmin = computed(() => this.authService.currentUser()?.role === 'Admin');

  showAddModal = signal(false);
  isEditMode = signal(false);
  selectedStaff = signal<StaffDTO | null>(null);
  staffForm: FormGroup;

  showDeleteConfirm = signal(false);
  staffToDelete = signal<StaffDTO | null>(null);
  updatingCustomerStatusId = signal<string | null>(null);
  showCustomerStatusConfirm = signal(false);
  customerToUpdateStatus = signal<CustomerDTO | null>(null);

  activeDropdownId = signal<string | null>(null);
  dropdownPosition = signal({ top: '0px', left: '0px' });

  private readonly managedRoles = ['Seller', 'WareHouseManager', 'HR'];

  constructor(
    private userAdminService: UserAdminService,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.staffForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      role: ['Seller', Validators.required],
      birthday: ['', Validators.required],
      identify: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      isActive: [false]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    if (this.currentTab() === 'customer') {
      if (!this.isAdmin()) {
        this.currentTab.set('staff');
        this.loadData();
        return;
      }

      this.userAdminService.getCustomers().subscribe({
        next: (res) => {
          this.customerList.set(res);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastService.error('Không thể tải danh sách khách hàng');
          this.isLoading.set(false);
        }
      });

      return;
    }

    this.userAdminService.getStaff().subscribe({
      next: (res) => {
        const staff = res.filter((user) => this.managedRoles.includes(user.role));
        this.staffList.set(staff);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Không thể tải danh sách nhân viên');
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'staff' | 'customer') {
    if (tab === 'customer' && !this.isAdmin()) return;
    this.currentTab.set(tab);
    this.searchQuery.set('');
    this.activeDropdownId.set(null);
    this.loadData();
  }

  filteredStaff = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const staff = this.staffList();

    if (!query) return staff;

    return staff.filter((user) =>
      (user.fullName || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.phone || '').includes(query) ||
      (user.identify || user.employeeProfile?.identify || '').includes(query) ||
      this.getRoleLabel(user.role).toLowerCase().includes(query)
    );
  });

  activeStaffCount = computed(() => this.staffList().filter((staff) => staff.isActive).length);

  inactiveStaffCount = computed(() => this.staffList().filter((staff) => !staff.isActive).length);

  filteredCustomers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const customers = this.customerList();

    if (!query) return customers;

    return customers.filter((user) =>
      (user.fullName || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.phone || '').includes(query) ||
      (user.address || '').toLowerCase().includes(query)
    );
  });

  openAddModal() {
    this.isEditMode.set(false);
    this.selectedStaff.set(null);
    this.staffForm.reset({
      email: '',
      password: '',
      fullName: '',
      phone: '',
      address: '',
      role: 'Seller',
      birthday: '',
      identify: '',
      salary: 0,
      isActive: true
    });
    this.staffForm.get('password')?.setValidators([Validators.required]);
    this.staffForm.get('password')?.updateValueAndValidity();
    this.staffForm.get('email')?.enable();
    this.staffForm.get('isActive')?.enable();
    this.showAddModal.set(true);
  }

  openEditModal(staff: StaffDTO | null) {
    if (!staff) return;

    this.isEditMode.set(true);
    this.selectedStaff.set(staff);
    this.activeDropdownId.set(null);

    this.staffForm.patchValue({
      email: staff.email,
      fullName: staff.fullName,
      phone: staff.phone,
      address: staff.address,
      role: staff.role || 'Seller',
      birthday: this.toInputDate(staff.birthday || staff.employeeProfile?.date),
      identify: staff.identify || staff.employeeProfile?.identify || '',
      salary: staff.salary ?? staff.employeeProfile?.salary ?? 0,
      isActive: staff.isActive
    });

    this.staffForm.get('password')?.clearValidators();
    this.staffForm.get('password')?.updateValueAndValidity();
    this.staffForm.get('email')?.disable();
    this.staffForm.get('isActive')?.enable();
    this.showAddModal.set(true);
  }

  closeModal() {
    this.showAddModal.set(false);
    this.selectedStaff.set(null);
    this.staffForm.get('isActive')?.enable();
  }

  submitForm() {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    const formData = this.staffForm.getRawValue();
    this.isLoading.set(true);

    if (this.isEditMode()) {
      const request: UpdateUserRequest = {
        id: this.selectedStaff()?.id!,
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
          this.toastService.success('Cập nhật nhân viên thành công');
          this.loadData();
          this.closeModal();
        },
        error: (err) => {
          this.toastService.error('Lỗi khi cập nhật nhân viên');
          console.error('Update staff error:', err);
          this.isLoading.set(false);
        }
      });

      return;
    }

    const request: CreateUserRequest = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      role: formData.role,
      birthday: formData.birthday,
      identify: formData.identify,
      salary: Number(formData.salary || 0),
      isActive: formData.isActive
    };

    this.userAdminService.createUser(request).subscribe({
      next: () => {
        this.toastService.success('Thêm nhân viên thành công.');
        this.loadData();
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Lỗi khi thêm nhân viên');
        console.error('Create staff error:', err);
        this.isLoading.set(false);
      }
    });
  }

  deleteStaff(staff: StaffDTO | null) {
    if (!staff) return;
    this.staffToDelete.set(staff);
    this.activeDropdownId.set(null);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const staff = this.staffToDelete();
    if (!staff) return;

    this.userAdminService.deleteUser(staff.id).subscribe({
      next: () => {
        this.toastService.success('Xóa nhân viên thành công');
        this.loadData();
        this.showDeleteConfirm.set(false);
      },
      error: (err) => {
        this.toastService.error('Lỗi khi xóa nhân viên');
        console.error('Delete staff error:', err);
      }
    });
  }

  openCustomerStatusConfirm(customer: CustomerDTO): void {
    if (!customer?.id || this.updatingCustomerStatusId()) return;

    this.customerToUpdateStatus.set(customer);
    this.showCustomerStatusConfirm.set(true);
  }

  closeCustomerStatusConfirm(): void {
    this.customerToUpdateStatus.set(null);
    this.showCustomerStatusConfirm.set(false);
  }

  confirmCustomerStatusChange(): void {
    const customer = this.customerToUpdateStatus();
    if (!customer) return;
    this.toggleCustomerStatus(customer);
  }

  private toggleCustomerStatus(customer: CustomerDTO): void {
    if (!customer?.id || this.updatingCustomerStatusId()) return;

    this.updatingCustomerStatusId.set(customer.id);
    const nextStatus = !customer.isActive;

    this.userAdminService.updateCustomerStatus(customer.id, nextStatus).subscribe({
      next: () => {
        this.customerList.update((customers) =>
          customers.map((item) =>
            item.id === customer.id
              ? { ...item, isActive: nextStatus }
              : item
          )
        );

        this.toastService.success(
          !nextStatus
            ? 'Đã khóa tài khoản khách hàng'
            : 'Đã mở khóa tài khoản khách hàng'
        );
        this.updatingCustomerStatusId.set(null);
        this.closeCustomerStatusConfirm();
      },
      error: (err) => {
        this.toastService.error('Không thể cập nhật trạng thái khách hàng');
        console.error('Update customer status error:', err);
        this.updatingCustomerStatusId.set(null);
      }
    });
  }

  toggleDropdown(event: MouseEvent, staffId: string) {
    event.stopPropagation();
    if (this.activeDropdownId() === staffId) {
      this.activeDropdownId.set(null);
      return;
    }

    this.activeDropdownId.set(staffId);
    this.updateDropdownPosition(event);
  }

  updateDropdownPosition(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition.set({
      top: `${rect.bottom + 5}px`,
      left: `${rect.left - 136}px`
    });
  }

  @HostListener('document:click')
  hostClick() {
    this.activeDropdownId.set(null);
  }

  getSelectedStaffForAction() {
    const id = this.activeDropdownId();
    if (!id) return null;
    return this.staffList().find((user) => user.id === id) ?? null;
  }

  onEditAction() {
    this.openEditModal(this.getSelectedStaffForAction());
  }

  onDeleteAction() {
    this.deleteStaff(this.getSelectedStaffForAction());
  }

  getRoleLabel(role: string) {
    const labels: Record<string, string> = {
      Seller: 'Nhân viên bán hàng',
      WareHouseManager: 'Quản lý kho',
      HR: 'HR'
    };

    return labels[role] ?? role;
  }

  getIdentify(staff: StaffDTO) {
    return staff.identify || staff.employeeProfile?.identify || 'N/A';
  }

  getSalary(staff: StaffDTO) {
    return staff.salary ?? staff.employeeProfile?.salary ?? 0;
  }

  getBirthday(staff: StaffDTO) {
    return staff.birthday || staff.employeeProfile?.date || '';
  }

  private toInputDate(date?: string) {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
}
