import { Injectable, signal, computed } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Available departments
  readonly departments = signal<string[]>([
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations'
  ]);

  // Initial employee dataset
  private readonly _employees = signal<Employee[]>([
    {
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      department: 'IT',
      designation: 'Frontend Developer',
      salary: 65000,
      joinDate: '2023-01-15'
    },
    {
      name: 'Emily Johnson',
      email: 'emily.johnson@gmail.com',
      department: 'HR',
      designation: 'HR Manager',
      salary: 55000,
      joinDate: '2022-08-11'
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@gmail.com',
      department: 'Finance',
      designation: 'Accountant',
      salary: 72000,
      joinDate: '2021-11-01'
    },
    {
      name: 'Sophia Davis',
      email: 'sophia.davis@gmail.com',
      department: 'Marketing',
      designation: 'Marketing Executive',
      salary: 50000,
      joinDate: '2024-02-18'
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@gmail.com',
      department: 'Sales',
      designation: 'Sales Manager',
      salary: 68000,
      joinDate: '2020-06-12'
    }
  ]);

  // Read-only signal accessors
  readonly employees = this._employees.asReadonly();

  // Computed statistics using Angular Signals
  readonly totalEmployees = computed(() => this._employees().length);
  readonly totalDepartments = computed(() => this.departments().length);
  readonly totalSalary = computed(() =>
    this._employees().reduce((total, emp) => total + (Number(emp.salary) || 0), 0)
  );

  // Business logic methods
  addEmployee(emp: Employee): void {
    this._employees.update(list => [...list, emp]);
  }

  updateEmployee(originalIndex: number, emp: Employee): void {
    this._employees.update(list => {
      const updated = [...list];
      if (originalIndex >= 0 && originalIndex < updated.length) {
        updated[originalIndex] = emp;
      }
      return updated;
    });
  }

  deleteEmployee(originalIndex: number): void {
    this._employees.update(list => {
      const updated = [...list];
      if (originalIndex >= 0 && originalIndex < updated.length) {
        updated.splice(originalIndex, 1);
      }
      return updated;
    });
  }
}
