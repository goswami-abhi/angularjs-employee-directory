import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from './models/employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Departments
  departments: string[] = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations'
  ];

  // Employee Form Model
  employeeForm: Partial<Employee> = {};

  // Edit Mode Index
  editIndex: number = -1;

  // Search & Filter State
  searchText: string = '';
  selectedDepartment: string = '';
  sortBy: string = 'name';

  // Employee Data List
  employees: Employee[] = [
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
  ];

  // Save / Update Employee
  saveEmployee(): void {
    if (
      !this.employeeForm.name ||
      !this.employeeForm.email ||
      !this.employeeForm.department ||
      !this.employeeForm.designation ||
      this.employeeForm.salary == null ||
      !this.employeeForm.joinDate
    ) {
      return;
    }

    const newEmp: Employee = {
      name: this.employeeForm.name,
      email: this.employeeForm.email,
      department: this.employeeForm.department,
      designation: this.employeeForm.designation,
      salary: Number(this.employeeForm.salary),
      joinDate: this.employeeForm.joinDate
    };

    if (this.editIndex === -1) {
      this.employees.push(newEmp);
    } else {
      this.employees[this.editIndex] = newEmp;
      this.editIndex = -1;
    }

    this.resetForm();
  }

  // Edit Employee
  editEmployee(emp: Employee): void {
    const originalIndex = this.employees.indexOf(emp);
    if (originalIndex !== -1) {
      this.employeeForm = { ...emp };
      this.editIndex = originalIndex;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // Delete Employee
  deleteEmployee(emp: Employee): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      const originalIndex = this.employees.indexOf(emp);
      if (originalIndex !== -1) {
        this.employees.splice(originalIndex, 1);
        if (this.editIndex === originalIndex) {
          this.resetForm();
        }
      }
    }
  }

  // Clear / Reset Form
  resetForm(): void {
    this.employeeForm = {};
    this.editIndex = -1;
  }

  // Total Salary Calculation
  getTotalSalary(): number {
    let total = 0;
    for (const emp of this.employees) {
      total += Number(emp.salary) || 0;
    }
    return total;
  }

  // Filtered and Sorted Employees
  get filteredEmployees(): Employee[] {
    let list = [...this.employees];

    if (this.selectedDepartment) {
      list = list.filter(emp => emp.department === this.selectedDepartment);
    }

    if (this.searchText && this.searchText.trim()) {
      const term = this.searchText.toLowerCase().trim();
      list = list.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        String(emp.salary).includes(term)
      );
    }

    if (this.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'salary') {
      list.sort((a, b) => (Number(a.salary) || 0) - (Number(b.salary) || 0));
    } else if (this.sortBy === 'department') {
      list.sort((a, b) => a.department.localeCompare(b.department));
    }

    return list;
  }
}
