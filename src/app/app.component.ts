import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Inject EmployeeService using inject() function (Angular best practice)
  readonly employeeService = inject(EmployeeService);

  // Form State Signals
  readonly employeeForm = signal<Partial<Employee>>({});
  readonly editIndex = signal<number>(-1);

  // Filter & Search Signals
  readonly searchText = signal<string>('');
  readonly selectedDepartment = signal<string>('');
  readonly sortBy = signal<'name' | 'salary' | 'department'>('name');

  // Computed Filtered and Sorted Employee List
  readonly filteredEmployees = computed(() => {
    let list = [...this.employeeService.employees()];
    const dept = this.selectedDepartment();
    const search = this.searchText().toLowerCase().trim();
    const sortKey = this.sortBy();

    if (dept) {
      list = list.filter(emp => emp.department === dept);
    }

    if (search) {
      list = list.filter(emp =>
        emp.name.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.department.toLowerCase().includes(search) ||
        emp.designation.toLowerCase().includes(search) ||
        String(emp.salary).includes(search)
      );
    }

    if (sortKey === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === 'salary') {
      list.sort((a, b) => (Number(a.salary) || 0) - (Number(b.salary) || 0));
    } else if (sortKey === 'department') {
      list.sort((a, b) => a.department.localeCompare(b.department));
    }

    return list;
  });

  // Action: Save or Update Employee
  saveEmployee(): void {
    const form = this.employeeForm();
    if (
      !form.name ||
      !form.email ||
      !form.department ||
      !form.designation ||
      form.salary == null ||
      !form.joinDate
    ) {
      return;
    }

    const newEmp: Employee = {
      name: form.name,
      email: form.email,
      department: form.department,
      designation: form.designation,
      salary: Number(form.salary),
      joinDate: form.joinDate
    };

    const currentEditIdx = this.editIndex();
    if (currentEditIdx === -1) {
      this.employeeService.addEmployee(newEmp);
    } else {
      this.employeeService.updateEmployee(currentEditIdx, newEmp);
    }

    this.resetForm();
  }

  // Action: Populate Form for Editing
  editEmployee(emp: Employee): void {
    const originalIndex = this.employeeService.employees().indexOf(emp);
    if (originalIndex !== -1) {
      this.employeeForm.set({ ...emp });
      this.editIndex.set(originalIndex);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // Action: Delete Employee with Confirmation
  deleteEmployee(emp: Employee): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      const originalIndex = this.employeeService.employees().indexOf(emp);
      if (originalIndex !== -1) {
        this.employeeService.deleteEmployee(originalIndex);
        if (this.editIndex() === originalIndex) {
          this.resetForm();
        }
      }
    }
  }

  // Action: Reset / Clear Form State
  resetForm(): void {
    this.employeeForm.set({});
    this.editIndex.set(-1);
  }

  // Helper bindings for ngModel with Signals
  get currentFormName(): string { return this.employeeForm().name || ''; }
  set currentFormName(val: string) { this.employeeForm.update(f => ({ ...f, name: val })); }

  get currentFormEmail(): string { return this.employeeForm().email || ''; }
  set currentFormEmail(val: string) { this.employeeForm.update(f => ({ ...f, email: val })); }

  get currentFormDepartment(): string { return this.employeeForm().department || ''; }
  set currentFormDepartment(val: string) { this.employeeForm.update(f => ({ ...f, department: val })); }

  get currentFormDesignation(): string { return this.employeeForm().designation || ''; }
  set currentFormDesignation(val: string) { this.employeeForm.update(f => ({ ...f, designation: val })); }

  get currentFormSalary(): number | undefined { return this.employeeForm().salary; }
  set currentFormSalary(val: number | undefined) { this.employeeForm.update(f => ({ ...f, salary: val })); }

  get currentFormJoinDate(): string { return this.employeeForm().joinDate || ''; }
  set currentFormJoinDate(val: string) { this.employeeForm.update(f => ({ ...f, joinDate: val })); }

  get search(): string { return this.searchText(); }
  set search(val: string) { this.searchText.set(val); }

  get departmentFilter(): string { return this.selectedDepartment(); }
  set departmentFilter(val: string) { this.selectedDepartment.set(val); }

  get currentSortBy(): 'name' | 'salary' | 'department' { return this.sortBy(); }
  set currentSortBy(val: 'name' | 'salary' | 'department') { this.sortBy.set(val); }
}
